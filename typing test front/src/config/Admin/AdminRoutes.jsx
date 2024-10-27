import AdminDashBoard from '../../component/feature/admin/feature/dashboard/AdminDashBoard'
import Paragraphs from '../../component/feature/admin/feature/paragraphs/Paragraphs';
import AllUsers from '../../component/feature/admin/feature/users/allUsers/AllUsers';
import UserDetail from '../../component/feature/admin/feature/users/viewUsers/UserDetail';
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
        path : 'paragraphs',
        element : <Paragraphs />
    },
    {
        path : 'users/:username',
        element : <UserDetail />
    },
    {
        path : 'signout/:type',
        element : <Signout />
    }
]

export default adminRoutes;