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
    Query
} from "react-apollo"
import {Navigation} from "react-native-navigation"

// import navigation routers
import {  
    FEED_SCREEN,
    EXPLORE_ROOMS_SCREEN,
    PROFILE_SCREEN
} from "./../../navigation/screens";
import {  
     navigation_set_root_two_bottoms_tabs
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


class ExploreRooms extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            selected_set:new Set(),
        }
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

    navigate_to_feed = (data) =>{

        navigation_set_root_two_bottoms_tabs(
            {
                screen_name:FEED_SCREEN,  
                display_text:"FEED"
            }, 
            { 
                screen_name:EXPLORE_ROOMS_SCREEN,  
                display_text:"EXPLORE"
            },
            {
                screen_name:PROFILE_SCREEN,  
                display_text:"Profile",
                props:{
                    is_user:true
                }
            }
        )

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
                                    let not_joined_rooms = data ? data.not_joined_rooms : undefined

                                    if (not_joined_rooms){
                                        return(
                                            <Mutation mutation={BULK_ROOM_FOLLOWS}>
                                                {(bulk_follow_rooms, {loading, error, data})=>{
        
                                                    if (loading){
                                                        return <Text>Loading....</Text>
                                                    }
        
                                                    if (error){
                                                        return <Text>Error....</Text>
                                                    }
        
                                                    if (data){
                                                        this.navigate_to_feed(data) 
                                                    }
                                                    
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
                                                                
                                                            />    
                                                            {
                                                                this.state.selected_set.size!==0?
                                                                <View style={styles.join_button_container}>
                                                                    <View style={styles.join_button_main_view}>
                                                                        <BigButton
                                                                            button_text={"Join Rooms"}
                                                                            onPress={async()=> {
                                                                                //getting the user_id 
                                                                                const {user_info} = await client.query({
                                                                                    query:GET_USER_INFO
                                                                                }) 
                                                                                const bulk_join_objects = this.generate_selected_rooms_arr(user_info.user_id)
                                                                                                                                                    
                                                                                //mutation bulk follow rooms
                                                                                bulk_follow_rooms({variables:{follow_room_objects:bulk_join_objects}})
                                                                            }}
                                                                        />
                                                                    </View>
                                                                </View>
                                                                :
                                                                undefined
                                                            }
                                                                                                                                                           
                                                        </SafeAreaView>
                                                    )
                                                }}                            
                                            </Mutation>
                                        )
                                    }

                                    return(
                                        <Loader/>
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

export default ExploreRooms
