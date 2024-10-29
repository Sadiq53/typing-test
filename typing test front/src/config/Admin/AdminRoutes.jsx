import BlogEditor from '../../component/feature/admin/feature/blog/BlogEditor';
import BlogPage from '../../component/feature/admin/feature/blog/BlogPage';
import BlogView from '../../component/feature/admin/feature/blog/BlogView';
import AdminDashBoard from '../../component/feature/admin/feature/dashboard/AdminDashBoard'
import Paragraphs from '../../component/feature/admin/feature/paragraphs/Paragraphs';
import AllUsers from '../../component/feature/admin/feature/users/allUsers/AllUsers';
import UserDetail from '../../component/feature/admin/feature/users/viewUsers/UserDetail';
import UserMatches from '../../component/feature/admin/feature/users/viewUsers/UserMatches';
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
        path : 'blog-add',
        element : <BlogEditor />
    },
    {
        path : 'blog-add/:id',
        element : <BlogEditor />
    },
    {
        path : 'blog',
        element : <BlogPage />
    },
    {
        path : 'blog/:id',
        element : <BlogView />
    },
    {
        path : 'users/:username',
        element : <UserDetail />
    },
    {
        path : 'users/matches/:level',
        element : <UserMatches />
    },
    {
        path : 'signout/:type',
        element : <Signout />
    }
]

export default adminRoutes;