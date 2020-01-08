import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
    Container,
    Header,
    Avatar,
    Name,
    Bio,
    Stars,
    Starred,
    OwnerAvatar,
    Info,
    Title,
    Author,
} from './styles';

export default class User extends Component {
    state = {
        stars: [],
        loading: true,
        page: 1,
        refreshing: false,
    };

    async componentDidMount() {
        this.load();
    }

    load = async (page = 1) => {
        const { navigation } = this.props;
        const user = navigation.getParam('user');
        const { stars } = this.state;

        const response = await api.get(`/users/${user.login}/starred`, {
            params: {
                page,
            },
        });

        this.setState({
            stars: [...stars, ...response.data],
            loading: false,
            refreshing: false,
            page,
        });
    };

    loadMore = () => {
        const { page } = this.state;
        const nextPage = page + 1;
        this.load(nextPage);
    };

    refreshList = () => {
        this.setState({ refreshing: true, stars: [], page: 1 }, this.load);
    };

    handleNavigate = repository => {
        const { navigation } = this.props;
        navigation.navigate('Repository', { repository });
    };

    render() {
        const { navigation } = this.props;
        const { stars, loading, refreshing } = this.state;
        const user = navigation.getParam('user');

        return (
            <Container>
                <Header>
                    <Avatar source={{ uri: user.avatar }} />
                    <Name>{user.name}</Name>
                    <Bio>{user.bio}</Bio>
                </Header>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Stars
                        onRefresh={this.refreshList}
                        refreshing={refreshing}
                        onEndReachedThreshold={0.2}
                        onEndReached={this.loadMore}
                        data={stars}
                        keyExtractor={star => String(star.id)}
                        renderItem={({ item }) => (
                            <Starred onPress={() => this.handleNavigate(item)}>
                                <OwnerAvatar
                                    source={{ uri: item.owner.avatar_url }}
                                />
                                <Info>
                                    <Title>{item.name}</Title>
                                    <Author>{item.owner.login}</Author>
                                </Info>
                            </Starred>
                        )}
                    />
                )}
            </Container>
        );
    }
}

User.avigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
});

User.propTypes = {
    navigation: PropTypes.shape({
        getParam: PropTypes.func,
        navigate: PropTypes.func,
    }).isRequired,
};
