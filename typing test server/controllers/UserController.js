const route = require('express').Router();
const jwt = require('jsonwebtoken');
const sha = require('sha1')
const userModel = require('../model/UserSchema')
const key = require('../config/token_Keys');
const randNum = require('random-number')

const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0; // Avoid division by zero
    const sum = numbers.reduce((acc, num) => acc + num, 0); // Sum the numbers
    return sum / numbers.length; // Return the average
};

route.get('/:id', async(req, res) => {
    // console.log(req.headers.authorization)
    if(req.headers.authorization){
        let ID = jwt.decode(req.params.id, key)
        let userData = await userModel.findOne({_id : ID?.id})
        if(userData) {
            res.send({ status : 200, userdata : userData })
        }else{
            res.send({status : 403})
        }
    }
});

route.get('/dashdata/:limit/:type', async(req, res) => {

    const fetchFilteredData = async (filterType, limit) => {
        const levels = ['all', 'easy', 'medium', 'hard'];
        const queries = levels.map(level => ({
            [`${filterType}.${level}.avgwpm`]: { $gt: 20 },
            [`${filterType}.${level}.avgconsis`]: { $gt: 20 },
            [`${filterType}.${level}.avgacc`]: { $gt: 20 }
        }));
    
        const results = await userModel.find({
            $or: queries
        }).limit(limit);
    
        return results; // This returns the unique users based on the combined criteria
    };
    
    // Assuming 'req' is your request object
    const limit = parseInt(req.params.limit, 10);
    const type = req.params.type;
    
    const typeMap = {
        '1': 'top1minavg',
        '3': 'top3minavg',
        '5': 'top5minavg'
    };
    
    const filterType = typeMap[type];
    
    if (!filterType) {
        return res.status(400).send({ message: 'Invalid type provided' });
    }
    
    // console.log(`Fetching data for filterType: ${filterType} with limit: ${limit}`);
    const allUser = await fetchFilteredData(filterType, limit);
    // console.log(allUser);
    
    // const allUser = await userModel.find({}).limit(limit)
    
    const extractLevelData = (matchData, level) => {
        const filteredData = matchData?.filter(value => value.level === level);
        
        return {
            avgWpm: calculateAverage(filteredData.map(value => value.avgwpm)),
            avgAcc: calculateAverage(filteredData.map(value => value.avgacc)),
            avgConsis: calculateAverage(filteredData.map(value => value.avgconsis)),
        };
    };
    
    
    const filteredData = allUser?.map(value => {
        const match1 = value?.match_1 || [];
        const match3 = value?.match_3 || [];
        const match5 = value?.match_5 || [];
    
        // Calculate overall averages for match 1, 3, and 5
        const match1Data = {
            avgAcc1: calculateAverage(match1.map(value => parseFloat(value.avgacc))),
            avgConsis1: calculateAverage(match1.map(value => parseFloat(value.avgconsis))),
            avgWpm1: calculateAverage(match1.map(value => parseFloat(value.avgwpm))),
        };
    
        const match3Data = {
            avgAcc3: calculateAverage(match3.map(value => parseFloat(value.avgacc))),
            avgConsis3: calculateAverage(match3.map(value => parseFloat(value.avgconsis))),
            avgWpm3: calculateAverage(match3.map(value => parseFloat(value.avgwpm))),
        };
    
        const match5Data = {
            avgAcc5: calculateAverage(match5.map(value => value.avgacc)),
            avgConsis5: calculateAverage(match5.map(value => parseFloat(value.avgconsis))),
            avgWpm5: calculateAverage(match5.map(value => parseFloat(value.avgwpm))),
        };
    
        // Extract data for easy, medium, and hard levels
        const easy1 = extractLevelData(match1, 'easy');
        const medium1 = extractLevelData(match1, 'medium');
        const hard1 = extractLevelData(match1, 'hard');
    
        const easy3 = extractLevelData(match3, 'easy');
        const medium3 = extractLevelData(match3, 'medium');
        const hard3 = extractLevelData(match3, 'hard');
    
        const easy5 = extractLevelData(match5, 'easy');
        const medium5 = extractLevelData(match5, 'medium');
        const hard5 = extractLevelData(match5, 'hard');
    
        return {
            username: value?.username,
            all: {
                match1Data,
                match3Data,
                match5Data
            },
            easy1,
            medium1,
            hard1,
            easy3,
            medium3,
            hard3,
            easy5,
            medium5,
            hard5
        };
    });

    // console.log(filteredData[1]?.all)
    // console.log(allUser[1]?.match_1)
    res.send({status : 200, userData : filteredData, type : "pagination", message : "Leaderboard Data"})
});

route.post('/signin', async(req, res) => {
    const { signin, password, type } = req.body;
    let isUserExist;
    if(type === 'username') {
        isUserExist = await userModel.findOne({ username : signin }) 
    } else {
        isUserExist = await userModel.findOne({ email : signin }) 
    }
    if(isUserExist) {
        if(sha(password) === isUserExist?.password) {
            const ID = {id : isUserExist?._id};
            const token = jwt.sign(ID, key)
            res.send({ status : 200, token : token, message : "Logged in Successfully", type : 'signin' })
        } else res.send({ status : 402, message : "Password is Incorrect", type : 'signin' })
    } else res.send({ status : 401, message : "Email ID is Invalid", type : 'signin' })
});

route.post('/signup', async(req, res) => {
    const { email, username, password, createdate } = req.body;

    const checkUserName = await userModel.findOne({ username : username })
    if(!checkUserName) {
        const checkEmail = await userModel.findOne({ email : email })
        if(!checkEmail) {
            const accountID = randNum.generator({ min : 100000, max : 9999999, integer : true });
            const finalData = {
                username : username,
                email : email,
                password : sha(password),
                createdate : createdate,
                accountid : accountID()
            }
            await userModel.create(finalData)
            const getUser = await userModel.findOne({ email : email })
            const ID = {id : getUser?._id};
            const token = jwt.sign(ID, key)
            res.send({ status : 200, token : token })
        } else res.send({ status : 402, message : "Email ID Exist", type : 'signup' }) 
    } else res.send({ status : 402, message : "username exist", type : 'signup' })

})

route.post('/updatepass/:id', async(req, res) => {
    if(req.headers.authorization){
        const ID = jwt.decode(req.params.id, key)
        // console.log(ID.id, req.body )
        const { currentpassword, newpassword } = req.body;
        const findUser = await userModel.findOne({ _id : ID.id })
        if(findUser) {
            if(findUser?.password === sha(currentpassword)) {
                await userModel.updateOne({ _id : ID?.id }, { password : sha(newpassword) })
                res.send({ status : 200 })
            }
        }
    }
});

route.post('/', async (req, res) => {
    // console.log(req.body)
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);
        const { wpm, consistency, accuracy, correctChars, incorrectChars, extraChars, time, level } = req.body.data;
        const {date} = req.body
        
        const avgWpm = calculateAverage(wpm)
        const avgConsis = calculateAverage(consistency)
        const avgAcc = calculateAverage(accuracy)
        
        const testData = { 
            accuracy : accuracy,
            consistency : consistency,
            wpm : wpm,
            avgwpm : avgWpm,
            avgacc : avgAcc,
            avgconsis : avgConsis,
            matchdate : date,
            time : time,
            level : level !== "" ? level : 'easy',
            characters : { 
                correct : correctChars,
                incorrect : incorrectChars,
                extra : extraChars,
            }}
            
      // Create a mapping of time values to match properties
        const matchPropertyMap = {
            60: 'match_1',
            15: 'match_1',
            180: 'match_3',
            300: 'match_5',
        };

        // Mapping match properties to total average fields
        const findPropertyMatch = {
            'match_1': "top1minavg",
            'match_3': "top3minavg",
            'match_5': "top5minavg",
        };

        // Helper function to calculate new average
        const calculateNewAverage = (currentAvg, newValue, length) => 
            (currentAvg * length + newValue) / (length + 1);

        const matchProperty = matchPropertyMap[time];
            
        if (matchProperty) {
            // Add new data to match property array
            await userModel.updateOne({ _id: ID.id }, { $push: { [matchProperty]: testData } });
        
            const getUserData = await userModel.findOne({ _id: ID.id });
        
            const findProperty = findPropertyMatch[matchProperty];
            const checkDataPresent = getUserData?.[matchProperty];
            
            if (checkDataPresent?.length !== 0) {
                const getTotalAvgData = getUserData?.[findProperty];
                const dataLength = checkDataPresent?.length;
                let levelDataLength = checkDataPresent?.map(value => value.level === level)
                levelDataLength = levelDataLength?.length
        
                // Calculate all averages
                const allData = {
                    avgwpm: calculateNewAverage(getTotalAvgData?.all?.avgwpm, avgWpm, dataLength),
                    avgacc: calculateNewAverage(getTotalAvgData?.all?.avgacc, avgAcc, dataLength),
                    avgconsis: calculateNewAverage(getTotalAvgData?.all?.avgconsis, avgConsis, dataLength),
                };
        
                // Calculate level-based averages
                const levelData = {
                    avgwpm: calculateNewAverage(getTotalAvgData?.[level]?.avgwpm, avgWpm, dataLength),
                    avgacc: calculateNewAverage(getTotalAvgData?.[level]?.avgacc, avgAcc, dataLength),
                    avgconsis: calculateNewAverage(getTotalAvgData?.[level]?.avgconsis, avgConsis, dataLength),
                };
        
                // Update the document with the new averages
                await userModel.updateMany(
                    { _id: ID.id },
                    { $set: { [`${findProperty}.all`]: allData, [`${findProperty}.${level}`]: levelData } }
                );
            } 

            return res.send({ status: 200, message: "test complete", type: "update", stats: testData });
        } else {
            return res.send({status : 400, message : "Invalid time line", type : "update"});
        }
    } else {
        return res.send({status : 401, message : "invalid ID", type : "auth"});
    }
});


route.put('/', async(req, res) => {
    
});

route.delete('/', async(req, res) => {

});




module.exports = route;


// if (getUserData) {
//     const extractData = (matchData) => ({
//         allAvgAcc: matchData?.map(value => value.avgacc),
//         allAvgConsis: matchData?.map(value => value.avgconsis),
//         allAvgWpm: matchData?.map(value => value.avgwpm),
//         easyAvgAcc: matchData?.filter(value => value.level === 'easy')?.map(value => value.avgacc),
//         easyAvgConsis: matchData?.filter(value => value.level === 'easy')?.map(value => value.avgconsis),
//         easyAvgWpm: matchData?.filter(value => value.level === 'easy')?.map(value => value.avgwpm),
//         mediumAvgAcc: matchData?.filter(value => value.level === 'medium')?.map(value => value.avgacc),
//         mediumAvgConsis: matchData?.filter(value => value.level === 'medium')?.map(value => value.avgconsis),
//         mediumAvgWpm: matchData?.filter(value => value.level === 'medium')?.map(value => value.avgwpm),
//         hardAvgAcc: matchData?.filter(value => value.level === 'hard')?.map(value => value.avgacc),
//         hardAvgConsis: matchData?.filter(value => value.level === 'hard')?.map(value => value.avgconsis),
//         hardAvgWpm: matchData?.filter(value => value.level === 'hard')?.map(value => value.avgwpm)
//     });

//     const calculateMatchAvg = (matchData) => ({
//         all: {
//             avgwpm: calculateAverage(matchData?.allAvgWpm),
//             avgacc: calculateAverage(matchData?.allAvgAcc),
//             avgconsis: calculateAverage(matchData?.allAvgConsis),
//         },
//         easy: {
//             avgwpm: calculateAverage(matchData?.easyAvgWpm),
//             avgacc: calculateAverage(matchData?.easyAvgAcc),
//             avgconsis: calculateAverage(matchData?.easyAvgConsis),
//         },
//         medium: {
//             avgwpm: calculateAverage(matchData?.mediumAvgWpm),
//             avgacc: calculateAverage(matchData?.mediumAvgAcc),
//             avgconsis: calculateAverage(matchData?.mediumAvgConsis),
//         },
//         hard: {
//             avgwpm: calculateAverage(matchData?.hardAvgWpm),
//             avgacc: calculateAverage(matchData?.hardAvgAcc),
//             avgconsis: calculateAverage(matchData?.hardAvgConsis),
//         },
//     });

//     const match1Data = extractData(getUserData?.match_1);
//     const match3Data = extractData(getUserData?.match_3);
//     const match5Data = extractData(getUserData?.match_5);

//     const match1Avg = calculateMatchAvg(match1Data);
//     const match3Avg = calculateMatchAvg(match3Data);
//     const match5Avg = calculateMatchAvg(match5Data);

// }