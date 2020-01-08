import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import User from './pages/User';
import Repository from './pages/Repository';

const Routes = createAppContainer(
    createStackNavigator(
        {
            Main,
            User,
            Repository,
        },
        {
            headerTitleAlign: 'center',
            defaultNavigationOptions: {
                headerStyle: {
                    backgroundColor: '#4d80e4',
                },
                headerTintColor: '#FFF',
                headerBackTitleVisible: false,
            },
        }
    )
);

export default Routes;
