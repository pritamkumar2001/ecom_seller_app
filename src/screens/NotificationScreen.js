import React, { useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import styled from 'styled-components/native';

const initialNotifications = [
  { id: 'AW00008', message: 'Congrats, You have a new order received.', read: false },
  { id: 'AW00006', message: 'Congrats, You have a new order received.', read: false },
  { id: 'AW00003', message: 'Congrats, You have a new order received.', read: false },
  { id: 'AW00008', message: 'Congrats, You have a new order received.', read: false },
  { id: 'AW00006', message: 'Congrats, You have a new order received.', read: false },
  { id: 'AW00003', message: 'Congrats, You have a new order received.', read: false },
];

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'read', 'unread'

  const markAsRead = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].read = true;
    setNotifications(updatedNotifications);
  };

  const deleteNotification = (index) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'read' && notification.read) ||
      (filter === 'unread' && !notification.read);
    const matchesSearch = notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Container>
      <Header>
        <Title>Notifications</Title>
        {notifications.length > 0 && (
          <Actions>
            <ActionButton onPress={markAllAsRead}>
              <ActionButtonText>Mark All as Read</ActionButtonText>
            </ActionButton>
            <ActionButton onPress={deleteAllNotifications}>
              <ActionButtonText>Delete All</ActionButtonText>
            </ActionButton>
          </Actions>
        )}
      </Header>

      {/* <SearchBar
        placeholder="Search notifications..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      /> */}

      <FilterContainer>
        <FilterButton selected={filter === 'all'} onPress={() => setFilter('all')}>
          <FilterText>All</FilterText>
        </FilterButton>
        <FilterButton selected={filter === 'read'} onPress={() => setFilter('read')}>
          <FilterText>Read</FilterText>
        </FilterButton>
        <FilterButton selected={filter === 'unread'} onPress={() => setFilter('unread')}>
          <FilterText>Unread</FilterText>
        </FilterButton>
      </FilterContainer>

      <ScrollView>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <NotificationCard key={index} read={notification.read}>
              <NotificationText>{notification.message}</NotificationText>
              <OrderId>Order Id: {notification.id}</OrderId>
              <Actions>
                {!notification.read && (
                  <ActionButton onPress={() => markAsRead(index)}>
                    <ActionButtonText>Mark as Read</ActionButtonText>
                  </ActionButton>
                )}
                <ActionButton onPress={() => deleteNotification(index)}>
                  <ActionButtonText>Delete</ActionButtonText>
                </ActionButton>
              </Actions>
            </NotificationCard>
          ))
        ) : (
          <EmptyText>No notifications found.</EmptyText>
        )}
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #848598;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
`;

const SearchBar = styled.TextInput`
  height: 40px;
  background-color: #fff;
  border-radius: 10px;
  padding: 0 10px;
  margin-bottom: 15px;
`;

const FilterContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 10px;
`;

const FilterButton = styled.TouchableOpacity`
  padding: 10px 20px;
  background-color: ${(props) => (props.selected ? '#008cff' : '#d3d3d3')};
  border-radius: 5px;
`;

const FilterText = styled.Text`
  color: ${(props) => (props.selected ? '#fff' : '#000')};
  font-size: 14px;
`;

const NotificationCard = styled.View`
  background-color: ${(props) => (props.read ? '#d3d3d3' : '#fff')};
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const NotificationText = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const OrderId = styled.Text`
  font-size: 14px;
  color: #555;
`;

const Actions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 10px;
`;

const ActionButton = styled.TouchableOpacity`
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #008cff;
  border-radius: 5px;
`;

const ActionButtonText = styled.Text`
  font-size: 14px;
  color: #fff;
`;

const EmptyText = styled.Text`
  text-align: center;
  color: #fff;
  font-size: 16px;
  margin-top: 20px;
`;

export default NotificationScreen;
