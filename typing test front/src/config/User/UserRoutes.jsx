import Blog from '../../component/feature/user/feature/Blog/Blog';
import BlogInner from '../../component/feature/user/feature/Blog/BlogInner';
import UserDashBoard from '../../component/feature/user/feature/dashboard/UserDashBoard';
import UserMatches from '../../component/shared/detailedMatches/UserMatches';
import LeaderBoard from '../../component/shared/leaderBoard/LeaderBoard';
import Lobby from '../../component/feature/user/feature/lobby/Lobby';
import TypingTestStats from '../../component/feature/user/feature/lobby/TypingTestStatistics';
import Signout from '../../component/shared/auth/Signout';

const userRoutes = [
    {
        path : '',
        element : <UserDashBoard />
    },
    {
        path : 'lobby',
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
        path : 'signout/:type',
        element : <Signout />
    },
    {
        path : 'matches/:level',
        element : <UserMatches />
    },
    {
        path : 'blog',
        element : <Blog />
    },
    {
        path : 'blog/:id',
        element : <BlogInner />
    },
]

export default userRoutes