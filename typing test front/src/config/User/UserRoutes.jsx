import UserDashBoard from '../../component/feature/user/feature/dashboard/UserDashBoard';
import LeaderBoard from '../../component/feature/user/feature/leaderBoard/LeaderBoard';
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
        path : 'signout',
        element : <Signout />
    },
]

export default userRoutes