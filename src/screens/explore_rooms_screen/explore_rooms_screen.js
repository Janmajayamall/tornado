import React from "react"
import { 
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    Mutation,
    ApolloConsumer,
    Query
} from "react-apollo"
import {Navigation} from "react-native-navigation"

//importing base style 
import base_style from "./../../styles/base"

//importing custom components
import RoomItemDisplay from "./components/room_item_display"
import ListItemDivider from "./../../custom_components/common_decorators/list_item_divider"
import { GET_NOT_JOINED_ROOMS, GET_LOCAL_USER_INFO, BULK_ROOM_FOLLOWS } from "./queries/index";
import { undefinedFieldMessage } from "graphql/validation/rules/FieldsOnCorrectType";


class ExploreRooms extends React.PureComponent{

    constructor(props){
        super(props)

        this.state = {
            selected_set:new Set()
        }
    }

    add_to_set = (index) => {
        if (this.state.selected_set.has(index)){
            return
        }else{
            this.setState((prev_state)=>{
                const new_set = prev_state.selected_set
                new_set.add(index)
                return({selected_set:new_set})
            })
        }
    }

    remove_from_set = (index) => {
        if (!this.state.selected_set.has(index)){
            return
        }else{
            this.setState((prev_state)=>{
                const new_set = prev_state.selected_set
                new_set.delete(index)
                return({selected_set:new_set})
            })
        }
    }

    generate_selected_rooms_arr = (rooms_arr, user_id) => {

        if (user_id===undefined || rooms_arr===undefined){
            return
        }
        
        let final_selected_arr = []
        //iterating through selected indexes
        for(let index of this.state.selected_set){
            final_selected_arr.push({
                room_id:user_id,
                follower_id:rooms_arr[index]._id,
            })
        }

        return final_selected_arr

    }

    navigate_to_feed = (data) =>{
        console.log(data, "added")
    }

    render(){
        return(
            <ApolloConsumer>
                {
                    client => (
                        <TouchableWithoutFeedback
                            onPress={()=>{
                                Keyboard.dismiss()
                            }}
                        >
                            <Query
                                query={GET_NOT_JOINED_ROOMS}
                            >
                                {({loading, error, data})=>{
                                    let not_joined_rooms = undefined
                                    if (data){
                                        not_joined_rooms = data.get_not_joined_rooms
                                    }
                                    if (loading){
                                        return <Text>LOADING.....</Text>
                                    }
        
                                    if (error){
                                        return <Text>Error thrown.....</Text>
                                    }
        
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
                                                        <View style={styles.main_container}>
                                                            <FlatList
                                                                data={not_joined_rooms}
                                                                renderItem={(object)=>{
                                                                    return(
                                                                        <RoomItemDisplay
                                                                            room_object={object.item}
                                                                            index={object.index}
                                                                            add_to_set={this.add_to_set}
                                                                            remove_from_set={this.remove_from_set}
                                                                        />
                                                                    )
                                                                }}
                                                                ItemSeparatorComponent={()=> {
                                                                    return <ListItemDivider/>
                                                                }}
                                                            />    
                                                            <TouchableOpacity
                                                                onPress={()=>{
                                                                    //getting the user_id 
                                                                    const {user_info} = client.readQuery({query:GET_LOCAL_USER_INFO}) 
                                                                    const bulk_join_objects = this.generate_selected_rooms_arr(not_joined_rooms, user_info.user_id)
                                                                    console.log(bulk_join_objects, "asaa")
                                                                    
                                                                    //mutation bulk follow rooms
                                                                    bulk_follow_rooms({variables:{follow_room_objects:bulk_join_objects}})
                                                                }}
                                                            >
                                                                <Text style={{color:"white"}}>
                                                                    nextdawdadawdadadaw
                                                                </Text>
                                                            </TouchableOpacity>                                                                                                                        
                                                        </View>
                                                    )
                                                }}                            
                                            </Mutation>
                                        )
                                    }
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
})

export default ExploreRooms
