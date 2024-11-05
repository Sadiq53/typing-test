import BlogEditor from '../../component/feature/blog/BlogEditor';
import BlogPage from '../../component/feature/blog/BlogPage';
import BlogView from '../../component/feature/blog/BlogView';
import AdminDashBoard from '../../component/feature/dashboard/AdminDashBoard'
import LeaderBoard from '../../component/shared/leaderBoard/LeaderBoard';
import Paragraphs from '../../component/feature/paragraphs/Paragraphs';
import AllUsers from '../../component/feature/users/allUsers/AllUsers';
import UserDetail from '../../component/feature/users/viewUsers/UserDetail';
import UserMatches from '../../component/shared/detailedMatches/UserMatches';
import Signout from '../../component/shared/auth/Signout';
import CreateUser from '../../component/feature/users/addUsers/CreateUser';
import Notification from '../../component/feature/notification/Notification';

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
        path : 'users/add',
        element : <CreateUser />
    },
    {
        path : 'leaderboard',
        element : <LeaderBoard />
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
        path : 'push-notification',
        element : <Notification />
    },
    {
        path : 'signout/:type',
        element : <Signout />
    }
]

export default adminRoutes;