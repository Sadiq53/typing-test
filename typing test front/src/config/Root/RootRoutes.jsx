import UserSignin from '../../component/feature/user/feature/auth/UserSignin'
import UserSignup from '../../component/feature/user/feature/auth/UserSignup'
import AdminSignin from '../../component/feature/admin/feature/auth/AdminSignin'
import Lobby from '../../component/feature/user/feature/lobby/Lobby';
import TypingTestStats from '../../component/feature/user/feature/lobby/TypingTestStatistics';
import LeaderBoard from '../../component/feature/user/feature/leaderBoard/LeaderBoard';
import Certificate from '../../component/feature/user/shared/certificate/Certificate';


const rootRoutes = [
    {
        path : '',
        element : <Lobby />
    },
    {
        path : 'stats',
        element : <TypingTestStats />
    },
    {
        path : 'leaderboard',
        element : <LeaderBoard />
    },
    {
        path : 'certificate',
        element : <Certificate />
    },
    {
        path : 'adminsignin',
        element : <AdminSignin />
    },
]

export default rootRoutes;