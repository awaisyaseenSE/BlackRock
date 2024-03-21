import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenComponent from '../components/ScreenComponent';
import colors from '../styles/colors';
import TopCompoWithHeading from '../components/TopCompoWithHeading';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database, {firebase} from '@react-native-firebase/database';
import ButtonComponent from '../components/ButtonComponent';
import TextInputCompo from '../components/TextInputCompo';
import fontFamily from '../styles/fontFamily';
import MyIndicator from '../components/MyIndicator';

export default function RealTimeDatabase() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [usersData, setUsersData] = useState([]);
  const [updateKey, setUpadatekey] = useState('');
  const [showUpdate, setShowUpadate] = useState(false);

  const databaseInit = firebase
    .app()
    .database(
      'https://blackrock-fb931-default-rtdb.asia-southeast1.firebasedatabase.app/',
    );

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      let temArr = []; // Initialize temArr as an empty array before fetching new data
      databaseInit.ref('users').on('value', snapshot => {
        temArr = []; // Clear temArr before fetching new data
        snapshot.forEach(snap => {
          let data = snap.val();
          temArr.push({...data, id: snap.key});
        });
        temArr.sort((a, b) => b.time - a.time);
        setUsersData(temArr);
        setLoading(false);
      });
      if (temArr.length == 0) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log('error in fetching real time data from database: ', error);
    }
  };

  const handleAddData = () => {
    setLoading(true);
    databaseInit
      .ref('users')
      .push({
        name: name,
        age: age,
        address: address,
        time: new Date().getTime().toString(),
      })
      .then(() => {
        setLoading(false);
        Alert.alert('Data is added to Real Time Database Successfully!');
        setAddress('');
        setAge('');
        setName('');
      })
      .catch(er => {
        setLoading(false);
        console.log('Error while adding data to real time database: ', er);
      });
  };

  const updateData = data => {
    setName(data?.name);
    setAge(data?.age);
    setAddress(data?.address);
    setUpadatekey(data?.id);
    setShowUpadate(true);
  };

  const handleUpdate = () => {
    try {
      setLoading(true);
      databaseInit
        .ref('/users/' + updateKey)
        .update({
          name: name,
          age: age,
          address: address,
        })
        .then(() => {
          setName('');
          setAge('');
          setAddress('');
          setShowUpadate(false);
          setLoading(false);
          Alert.alert('Data is updated successfully!');
        })
        .catch(er => {
          setLoading(false);
          console.log('err in updating: ', er);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const deleteData = id => {
    try {
      databaseInit
        .ref('/users/' + id)
        .remove()
        .then(() => {
          Alert.alert('Data is deleted successfully!');
        })
        .catch(er => console.log('Error in deleting data: ', er));
    } catch (error) {
      console.log('error in deleting: ', error);
    }
  };

  const handleDeleteData = id => {
    Alert.alert('Delete', 'Are you sure to Delete this item!', [
      {
        text: 'Yes',
        onPress: () => deleteData(id),
      },
      {
        text: 'No',
      },
    ]);
  };

  return (
    <>
      <ScreenComponent style={{backgroundColor: colors.moviesBg}}>
        <TopCompoWithHeading
          title="Real Time"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <TextInputCompo
            value={name}
            onChangeText={text => setName(text)}
            inputStyle={{backgroundColor: colors.gray}}
            placeholder="Full Name"
            placeholderTextColor={colors.lightBlack}
          />
          <TextInputCompo
            value={age}
            onChangeText={text => setAge(text)}
            inputStyle={{backgroundColor: colors.gray}}
            placeholder="age"
            placeholderTextColor={colors.lightBlack}
          />
          <TextInputCompo
            value={address}
            onChangeText={text => setAddress(text)}
            inputStyle={{backgroundColor: colors.gray}}
            placeholder="Address"
            placeholderTextColor={colors.lightBlack}
          />
          <ButtonComponent
            title={showUpdate ? 'Update data' : 'Add data'}
            style={showUpdate ? styles.updateBtn : styles.addBtn}
            onPress={showUpdate ? handleUpdate : handleAddData}
            loading={loading}
          />
          <View style={{flex: 1, marginBottom: 20}}>
            {loading ? (
              <ActivityIndicator color={colors.darkBlue} size={'large'} />
            ) : (
              <FlatList
                data={usersData}
                renderItem={({item}) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        <Text style={styles.text}>{item?.name}</Text>
                        <Text style={styles.subtext}>{item?.age}</Text>
                        <Text style={styles.subtext}>{item?.address}</Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          style={{marginHorizontal: 4}}
                          onPress={() => updateData(item)}>
                          <Image
                            source={require('../assets/edit.png')}
                            style={styles.icon}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{marginHorizontal: 4}}
                          onPress={() => handleDeleteData(item?.id)}>
                          <Image
                            source={require('../assets/delete.png')}
                            style={styles.icon}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
                ItemSeparatorComponent={<View style={styles.line} />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={{alignItems: 'center', marginTop: 30}}>
                    <ActivityIndicator size={40} color={colors.LightWhite} />
                  </View>
                }
              />
            )}
          </View>
        </View>
        <MyIndicator visible={loading} />
      </ScreenComponent>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addBtn: {
    marginVertical: 14,
    alignSelf: 'center',
    width: '50%',
    borderRadius: 8,
  },
  updateBtn: {
    marginVertical: 14,
    alignSelf: 'center',
    width: '50%',
    borderRadius: 8,
    backgroundColor: colors.primaryGreen,
  },
  text: {
    fontSize: 18,
    color: colors.lineColor,
    fontFamily: fontFamily.rubik_medium,
    marginVertical: 8,
  },
  line: {
    height: 1,
    backgroundColor: colors.borderColor,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 12,
  },
  subtext: {
    fontSize: 14,
    color: colors.gray,
    fontFamily: fontFamily.lato_regular,
    marginVertical: 2,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: colors.gray,
  },
});
