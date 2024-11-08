import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleBlockUnblockUser, handleGetAllUsers, resetState } from "../../../../redux/AdminDataSlice";
import { ADMIN_API_URL, BASE_API_URL } from "../../../../util/API_URL";
import { NavLink } from "react-router-dom";
import { dynamicToast } from "../../../shared/Toast/DynamicToast";
import StateCircleLoader from "../../../shared/loader/StateCircleLoader";
import DeleteUserModal from "../modals/DeleteUserModal";
import axios from "axios";
import Pagination from '../../../shared/pagination/Pagination'

const AllUsers = () => {
    const dispatch = useDispatch();
    const rawAllUsersData = useSelector(state => state.AdminDataSlice.allUserData) 
    const isFullfilled = useSelector((state) => state.AdminDataSlice.isFullfilled);
    const fullFillMsg = useSelector((state) => state.AdminDataSlice.fullFillMsg);
    const [loader, setLoader] = useState(false);
    const isProcessing = useSelector((state) => state.AdminDataSlice.isProcessing);
    const processingMsg = useSelector((state) => state.AdminDataSlice.processingMsg);
    const [deleteUsername, setDeleteUsername] = useState('')
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        setLoader(true);
        try {
            const response = await axios.get(`${ADMIN_API_URL}/users?page=${page}`);
            if(response.data.status === 200){
                setLoader(false);
                dispatch(handleGetAllUsers(response.data.data))
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(()=>{
        if(rawAllUsersData?.length !== 0) {
            setUsers(rawAllUsersData)
        }
    }, [dispatch, rawAllUsersData])

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    useEffect(() => {
        if (isFullfilled) {
            if (fullFillMsg?.type === "delete") {
                setLoader(false);
            }
            if(fullFillMsg?.type === 'block-unblock') {
                dynamicToast({ message: "Account Toggled Successfully!", icon: "success" });
                dispatch(resetState())
            }
            dispatch(resetState());
        }
    }, [isFullfilled, fullFillMsg, dispatch]);

    useEffect(() => {
        if(processingMsg?.type === 'block-unblock') {
            dispatch(resetState())
        }
        // dispatch(resetState());
    }, [isProcessing, processingMsg, dispatch]);

    const blockUser = (username) => {
        dispatch(handleBlockUnblockUser(username));
    };

    return (
        <>
            <section>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-md-12 py-4">
                            <h1>All Active Users</h1>
                        </div>
                        <div className="col-md-12">
                            <div className="alluser-table my-4">
                                <table className="table table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>View</th>
                                            <th>Edit</th>
                                            <th>Block</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users?.map((value, index) => (
                                            <tr key={value.username || index}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <NavLink to={`/admin/users/${value?.username}`}>
                                                        <div className="profile">
                                                            <img
                                                                src={
                                                                    value?.profile
                                                                        ? `${value?.profile}`
                                                                        : "/assets/images/profile.png"
                                                                }
                                                                alt=""
                                                            />
                                                            {value?.username}
                                                        </div>
                                                    </NavLink>
                                                </td>
                                                <td>
                                                    <NavLink to={`/admin/users/${value?.username}`}>
                                                        <button className="btn">
                                                            <i className="fa-solid fa-eye fa-lg"></i>
                                                        </button>
                                                    </NavLink>
                                                </td>
                                                <td>
                                                    <NavLink to="">
                                                        <button className="btn">
                                                            <i className="fa-solid fa-user-pen fa-lg" />
                                                        </button>
                                                    </NavLink>
                                                </td>
                                                <td>
                                                    <button className="btn" onClick={() => blockUser(value.username)}>
                                                        {!value.isblock ? (
                                                            <i class="fa-solid fa-shield-check fa-xl"></i>
                                                        ) : (
                                                            <i className="fa-solid fa-circle-xmark fa-xl" />                                                      
                                                        )}
                                                    </button>
                                                </td>
                                                <td>
                                                        <button className="btn" onClick={()=>setDeleteUsername(value.username)} data-bs-toggle="modal" data-bs-target="#deleteaccount">
                                                            <i className="fa-solid fa-user-xmark fa-lg"></i>
                                                        </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Pagination
                                    currentPage={currentPage} 
                                    totalPages={totalPages} 
                                    onPageChange={handlePageChange} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {loader && <StateCircleLoader />}
            <DeleteUserModal props={deleteUsername} />
        </>
    );
};

export default AllUsers;
