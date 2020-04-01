import React from "react"
import { 
    StyleSheet,
    SafeAreaView,
    FlatList, 
    Text

} from "react-native";
import PropTypes from "prop-types"
import { 
    Query
} from "react-apollo";
import { Navigation } from "react-native-navigation"

import base_style from "./../../styles/base"

//import graphql queries/mutations
import {
    GET_ALL_JOINED_ROOMS
} from "./../../apollo_client/apollo_queries/index"

//importing custom components 
import RoomItemDisplay from "../../custom_components/room_display/room_item_display"
import ListItemDivider from "./../../custom_components/common_decorators/list_item_divider"

//import helpers
import {
    constants
} from "./../../helpers/index"

class CreatePostRoomSelect extends React.Component{

    static propTypes = {
        add_room_to_set:PropTypes.func,
        remove_room_from_set:PropTypes.func,
        rooms_id_set:PropTypes.any, 
    }

    constructor(props){
        super(props)
        this.state = {
            
        }

        //binding the topBar add post button 
        Navigation.events().bindComponent(this);
    }

    //for topBar buttons
    navigationButtonPressed({ buttonId }) {
    
        if(buttonId === constants.navigation.action_buttons.DONE_POST_ROOM_SELECTION){
            Navigation.dismissModal(this.props.componentId)
        }

    }   

    add_room_to_set = (room_id) => {
        this.props.add_room_to_set(room_id)
    }

    remove_room_from_set = (room_id) => {
        this.props.remove_room_from_set(room_id)
    }

    render(){
        return(
            <Query query={GET_ALL_JOINED_ROOMS}>
                {({loading, error, data})=>{
                    if (loading){
                        return <Text>LOADING.....</Text>
                    }

                    if (error){
                        return <Text>ERROR.....</Text>
                    }

                    if(data.get_all_joined_rooms){
                        return(
                            <SafeAreaView style={styles.main_container}>
                                <FlatList
                                    data={data.get_all_joined_rooms}
                                    renderItem={(object)=>{
                                        return(
                                            <RoomItemDisplay
                                                room_object={object.item}
                                                index={object.index}
                                                add_to_set={this.add_room_to_set}
                                                remove_from_set={this.remove_room_from_set}
                                                selected={this.props.rooms_id_set.has(object.item._id)}
                                                selection_allowed={true}
                                            />
                                        )
                                    }}
                                    ItemSeparatorComponent={()=> {
                                        return <ListItemDivider/>
                                    }}
                                    
                                />                                                                                                                        
                            </SafeAreaView>                   
                        )
                    }
                }}
            </Query>

       )
    }
}

export default CreatePostRoomSelect

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        flex:1
    },    

})


