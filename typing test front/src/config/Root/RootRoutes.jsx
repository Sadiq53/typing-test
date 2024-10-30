import AdminSignin from '../../component/feature/admin/feature/auth/AdminSignin'
import Lobby from '../../component/feature/user/feature/lobby/Lobby';
import TypingTestStats from '../../component/feature/user/feature/lobby/TypingTestStatistics';
import LeaderBoard from '../../component/shared/leaderBoard/LeaderBoard';
import Blog from '../../component/feature/user/feature/Blog/Blog';
import BlogInner from '../../component/feature/user/feature/Blog/BlogInner';


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
        path : 'blog',
        element : <Blog />
    },
    {
        path : 'blog/:id',
        element : <BlogInner />
    },
    {
        path : 'adminsignin',
        element : <AdminSignin />
    },
]

export default rootRoutes;