import Header from "../../../../shared/header/Header"

const AllUsers = () => {
  return (
    <>
        <Header />
        <section>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-12">
                        {/* <div className="show-filter py-2">
                            <h1 className='font-active text-left'>0{timeFilter} Min {levelFilter} Mode</h1>
                            {
                                isLoading && (<div class="rl-loading-container">
                                    <div class="rl-loading-thumb rl-loading-thumb-1"></div>
                                    <div class="rl-loading-thumb rl-loading-thumb-2"></div>
                                    <div class="rl-loading-thumb rl-loading-thumb-3"></div>
                                </div>)
                            }
                        </div> */}
                        <div className="leaderboard-table my-3">
                            <table className="">
                                <thead>
                                    <tr>
                                    <th>#</th>
                                    <th>name</th>
                                    <th>View</th>
                                    <th>Edit</th>
                                    <th>Block</th>
                                    <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {
                                        displayData?.map((value, index) => (
                                            <tr>
                                                <td>{index+1}</td>
                                                <td><div className='profile'><img src={value?.profile ? `${BASE_API_URL}/uploads/${value?.profile}` : "/assets/images/profile.png"}  alt="" />{value?.username}</div></td>
                                                <td>{Math.round(value?.avgWpm)}</td>
                                                <td>{Math.round(value?.avgAcc)}</td>
                                                <td>{Math.round(value?.avgConsis)}</td>
                                            </tr>
                                        ))
                                    } */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default AllUsers