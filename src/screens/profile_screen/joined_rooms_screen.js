import React from 'react'
import { connect } from 'react-redux'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    SafeAreaView,
    FlatList
} from 'react-native'
import base_style from './../../styles/base'
import {
    Query, 
    ApolloConsumer,
    withApollo
} from 'react-apollo'
import { Navigation } from "react-native-navigation"
import PropTypes from "prop-types"

//importing queries/mutations in gql
import {
    GET_ALL_JOINED_ROOMS, GET_ALL_CREATED_ROOMS, GET_COMMON_ROOMS
} from "./../../apollo_client/apollo_queries/index"

//importing helpers & constants
import {
   constants
} from "./../../helpers/index"

//importing screens and navigation functions
import {  
    navigation_push_to_screen
} from '../../navigation/navigation_routes';
import {  
    ROOM_DETAILS_SCREEN
} from "./../../navigation/screens";

//importing custom components
import ListItemDivider from "./../../custom_components/common_decorators/list_item_divider"
import RoomItemDisplay from "./../../custom_components/room_display/room_item_display"
import Loader from "./../../custom_components/loading/loading_component"
import ErrorComponent from "./../../custom_components/loading/error_component"

const window = Dimensions.get("window")


class JoinedRoomsScreen extends React.PureComponent {

    static propTypes = {
        is_user:PropTypes.bool,
        query_type:PropTypes.string,

        //if is_user is false, then one of other_user_id or other_user_id_arr is required
        other_user_id:PropTypes.string,
        other_user_id_arr:PropTypes.array
    }

    constructor(props){

        super(props)

        this.state={
        }


    }

    componentDidMount(){
        //binding the topBar add post button 
        this.navigation_event_listener = Navigation.events().bindComponent(this);
    }

    //for topBar buttons
    navigationButtonPressed({ buttonId }) { 
        if(buttonId === constants.navigation.action_buttons.BACK){
            Navigation.pop(this.props.componentId)
        }
    }  

    componentWillUnmount(){
        this.navigation_event_listener.remove()
    }
    

    navigate_to_room_details = (room_object) => {
        navigation_push_to_screen(this.props.componentId, {
            screen_name:ROOM_DETAILS_SCREEN,
            props:{
                room_id:room_object._id
            }
        })
    }

    get_correct_query = () => {

        if(this.props.query_type===constants.queries.get_all_created_rooms){
            return GET_ALL_CREATED_ROOMS
        }

        if(this.props.query_type===constants.queries.get_all_joined_rooms){
            return GET_ALL_JOINED_ROOMS
        }

        if(this.props.query_type===constants.queries.get_common_rooms){
            return GET_COMMON_ROOMS
        }

    }

    get_query_variables = () => {

        //return object object if get_all_created_rooms or get_all_joined_rooms and is_user is true
        if(this.props.is_user && (this.props.query_type===constants.queries.get_all_created_rooms || this.props.query_type===constants.queries.get_all_joined_rooms)){
            return{}
        }
        
     
        if(this.props.query_type===constants.queries.get_all_created_rooms || this.props.query_type===constants.queries.get_all_joined_rooms){
            return({
                user_id:this.props.other_user_id
            })
        }

        if(this.props.query_type===constants.queries.get_common_rooms){
            return{
                user_ids:this.props.other_user_id_arr
            }
        }


    }

    render(){

        return(
            <Query 
                query={this.get_correct_query()}
                variables={this.get_query_variables()}
            >
                {({loading, error, data, refetch, networkStatus})=>{
                    
                    if(data){

                        return(
                            <SafeAreaView style={styles.main_container}>
                                <FlatList
                                    data={data[`${Object.keys(data)[0]}`]}
                                    renderItem={(object)=>{
                                        return(
                                            <RoomItemDisplay
                                                room_object={object.item}
                                                index={object.index}
                                                add_to_set={()=>{}}
                                                remove_from_set={()=>{}}
                                                selected={false}
                                                selection_allowed={false}
                                                selection_on_press_sub={()=>{
                                                    this.navigate_to_room_details(object.item)
                                                }}
                                            />
                                    )
                                    }}
                                    ItemSeparatorComponent={()=> {
                                        return <ListItemDivider/>
                                    }}   
                                    keyExtractor={item => item._id}                             
                                />    
                            </SafeAreaView>
                        )

                    }

                    if(!!error){
                        <View style={styles.main_container}>
                            <ErrorComponent
                                retry={()=>{
                                    refetch()
                                }}
                            />
                        </View>
                    }

                    return(
                        <View style={styles.main_container}>
                            <Loader/>
                        </View>
                    )
                }}
            </Query>
        )
    }

}

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        flex:1
    },
})

export default JoinedRoomsScreen

