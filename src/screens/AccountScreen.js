import React from 'react'
import { View, ScrollView, Text, AsyncStorage, ActivityIndicator, Image, Alert } from 'react-native'
import Button from 'react-native-button'
import Modal from 'react-native-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
import styles from '../utils/style'
import { getCredentials, onSignOut } from '../utils/auth'
import Unauthorized from '../components/Unauthorized'
import Personal from '../components/profile/Personal'
import Account from '../components/profile/Account'
import ProductList from '../components/profile/ProductList'
import * as authActions from '../actions/authAction'

class AccountScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            template: 'Account',
        }

        this.logout = this.logout.bind(this)
        this.geofencingSwitchChange = this.geofencingSwitchChange.bind(this)
        this.nbbiUpdatesSwitchChange = this.nbbiUpdatesSwitchChange.bind(this)
        this.cardExpSwitchChange = this.cardExpSwitchChange.bind(this)
        this.getProductDetails = this.getProductDetails.bind(this)
    }

    componentDidMount() {
        if (!this.props.userState.initialDataLoad) {
            if (this.props.userState.authentication === 'loggedin') {
                this.props.navigation.setParams({ authenticated: true })
            } else {
                this.props.navigation.setParams({ authenticated: false })
            }
        }
    }

    logout() {
        onSignOut()
          .then(() => {
            this.props.actions.logout()
            this.props.navigation.navigate('Login')
          })
    }

    geofencingSwitchChange(geofencing) {
        // BackgroundGeolocation.checkStatus(({ isRunning, authorization }) => {
        //     if (isRunning) {
        //         BackgroundGeolocation.stop()
        //         AsyncStorage.setItem('geofencing', 'false')
        //         this.props.actions.setGeofencing(false)
        //         return false
        //     }
        //     if (authorization == BackgroundGeolocation.auth.AUTHORIZED) {
        //         // calling start will also ask user for permission if needed
        //         // permission error will be handled in permisision_denied event
        //         BackgroundGeolocation.start()
        //         AsyncStorage.setItem('geofencing', 'true')
        //         this.props.actions.setGeofencing(true)
        //     } else {
        //         // Location services are disabled
        //         Alert.alert(
        //             'Location services disabled',
        //             'Would you like to open location settings?',
        //             [
        //                 {
        //                 text: 'Yes',
        //                 onPress: () => BackgroundGeolocation.showLocationSettings()
        //                 },
        //                 {
        //                     text: 'No',
        //                     onPress: () => console.log('No Pressed'),
        //                     style: 'cancel'
        //                 }
        //             ]
        //         )
        //     }
        // })
    }

    nbbiUpdatesSwitchChange(nbbiUpdates) {
        AsyncStorage.setItem('nbbiupdates', nbbiUpdates.toString())
        this.props.actions.setNbbiUpdates(nbbiUpdates)
    }

    cardExpSwitchChange(cardExp) {
        AsyncStorage.setItem('cardexp', cardExp.toString())
        this.props.actions.setCardExp(cardExp)
    }

    getProductDetails(productID) {
        this.props.actions.setSelectedProduct(productID)
            .then(() => this.props.navigation.navigate('ProductDetail'))
    }

    render() {
        if (this.props.userState.authentication !== 'loggedin') {
            return <Unauthorized userData={this.props.userState} logout={this.logout} geofencingSwitchChange={this.geofencingSwitchChange} />
        }

        return (
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ flex: 9 }}>
                    <ScrollView>
                        <Account
                          userData={this.props.userState}
                          geofencingSwitchChange={this.geofencingSwitchChange}
                          nbbiUpdatesSwitchChange={this.nbbiUpdatesSwitchChange}
                          cardExpSwitchChange={this.cardExpSwitchChange} />

                        <View style={{ alignItems: 'center' }}>
                            <Button
                              onPress={this.logout}
                              style={{ color: '#10ABDD', fontSize: 22 }} >
                                Logout
                            </Button>
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.notInsuranceTextContainer}>
                    <Text style={styles.notInsuranceText}>THIS IS NOT INSURANCE</Text>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userState: state.user,
    }
}
function matchDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    }
}

export default connect(mapStateToProps, matchDispatchToProps)(AccountScreen)
