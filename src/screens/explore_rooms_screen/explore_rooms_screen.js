import React from "react"
import { 
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView
} from "react-native";
import {
    Mutation,
    ApolloConsumer,
    Query,
    withQuery,
    withApollo
} from "react-apollo"
import {Navigation} from "react-native-navigation"

// import navigation routers
import {  
    FEED_SCREEN,
    EXPLORE_ROOMS_SCREEN,
    PROFILE_SCREEN
} from "./../../navigation/screens";
import {  
    navigation_set_bottom_tabs
} from "./../../navigation/navigation_routes/index";

//importing base style 
import base_style from "./../../styles/base"

//importing custom components
import RoomItemDisplay from "./../../custom_components/room_display/room_item_display"
import ListItemDivider from "./../../custom_components/common_decorators/list_item_divider"
import BigButton from "./../../custom_components/buttons/big_buttons"
import Loader from "./../../custom_components/loading/loading_component"

//importing graphql queries
import { 
    GET_NOT_JOINED_ROOMS, 
    BULK_ROOM_FOLLOWS, 
    GET_USER_INFO
} from "./../../apollo_client/apollo_queries/index";

// importing helpers
import {
    constants
} from "./../../helpers/index"


class ExploreRooms extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            selected_set:new Set(),

            //loading
            loading:false
        }
        
        //binding the topBar add post button 
        this.navigation_event_listener = Navigation.events().bindComponent(this);
    }

    //react native navigation event binded function for action buttons
    navigationButtonPressed({ buttonId }) {
        if (buttonId===constants.navigation.action_buttons.FOLLOW_BULK){
            //don't react if loading state is true
            if(this.state.loading){
                return 
            }

            this.follow_bulk_rooms()
        }
    }
    
    componentWillUnmount(){
        this.navigation_event_listener.remove()
    }

    add_to_set = (room_id) => {
        if (this.state.selected_set.has(room_id)){''
            return
        }else{
            this.setState((prev_state)=>{
                const new_set = prev_state.selected_set
                new_set.add(room_id)
                return({selected_set:new_set})
            })
        }
    }

    remove_from_set = (room_id) => {
        if (!this.state.selected_set.has(room_id)){
            return
        }else{
            this.setState((prev_state)=>{
                const new_set = prev_state.selected_set
                new_set.delete(room_id)
                return({selected_set:new_set})
            })
        }
    }

    generate_selected_rooms_arr = (user_id) => {

        //TODO: inform the user they haven't selected any room if rooms_arr length is 0

        if (user_id===undefined){
            return
        }
        
        let final_selected_arr = []
        //iterating through selected indexes
        for(let room_id of this.state.selected_set){
            final_selected_arr.push({
                room_id:room_id,
                follower_id:user_id,
            })
        }

        return final_selected_arr

    }

    follow_bulk_rooms = async() => {

        //checking if any room is selected or not 
        if(this.state.selected_set.size===0){
            //navigate to main screen. Remember user has not chosen any rooms
            navigation_set_bottom_tabs()
            return
        }
        
        //if loading state already true, then return 
        if(this.state.loading){
            return
        }

        //set loading state to tru 
        this.setState({loading:true})

        try{
            //getting the user_id 
            const {data} = await this.props.client.query({
                query:GET_USER_INFO
            }) 

            const bulk_join_objects = this.generate_selected_rooms_arr(data.get_user_info.user_id)
                                                                    
            //mutation bulk follow rooms
            const bulk_follow_object = await this.props.client.mutate({
                mutation:BULK_ROOM_FOLLOWS,
                variables:{
                    follow_room_objects:bulk_join_objects
                }
            })

            //navigate to the main screen
            navigation_set_bottom_tabs()
            return 
        }catch(e){            
            //TODO: show error to the user
        }

    }

    render(){
        return(
            <ApolloConsumer>
                {
                    client => (
                        <TouchableWithoutFeedback
                        >
                            <Query
                                query={GET_NOT_JOINED_ROOMS}
                            >
                                {({loading, error, data})=>{

                                    let not_joined_rooms = data ? data.get_not_joined_rooms : undefined
                                    if(not_joined_rooms && !this.state.loading){
                                        return(
                                            <SafeAreaView style={styles.main_container}>
                                                <FlatList
                                                    data={not_joined_rooms}
                                                    renderItem={(object)=>{
                                                        return(
                                                            <RoomItemDisplay
                                                                room_object={object.item}
                                                                index={object.index}
                                                                add_to_set={this.add_to_set}
                                                                remove_from_set={this.remove_from_set}
                                                                selected={false}
                                                                selection_allowed={true}
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

                                    //when loading of not_joined_rooms is undefined
                                    return(
                                        <View style={styles.main_container}>
                                            <Loader/>
                                        </View>
                                    )
                                }}
                            </Query>
                        </TouchableWithoutFeedback>                
                    )
                }

            </ApolloConsumer>
        )
    }
}

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        flex:1
    },    
    join_button_container:{
        justifyContent:"center",
        alignContent:"center",
        flexDirection:"row"
    },
    join_button_main_view:{
        width:"40%"
    }
})

export default withApollo(ExploreRooms)
