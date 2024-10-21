import AdminDashBoard from '../../component/feature/admin/feature/dashboard/AdminDashBoard'
import Signout from '../../component/shared/auth/Signout';

const adminRoutes = [
    {
        path : '',
        element : <AdminDashBoard />
    },
    {
        path : 'signout',
        element : <Signout />
    }
]

export default adminRoutes;