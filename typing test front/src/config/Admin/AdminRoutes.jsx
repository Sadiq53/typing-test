import AdminDashBoard from '../../component/feature/admin/feature/dashboard/AdminDashBoard'
import AllUsers from '../../component/feature/admin/feature/users/AllUsers';
import Signout from '../../component/shared/auth/Signout';

const adminRoutes = [
    {
        path : '',
        element : <AdminDashBoard />
    },
    {
        path : 'users',
        element : <AllUsers />
    },
    {
        path : 'signout/:type',
        element : <Signout />
    }
]

export default adminRoutes;