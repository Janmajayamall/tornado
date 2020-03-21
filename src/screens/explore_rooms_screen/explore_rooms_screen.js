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
import { GET_NOT_JOINED_ROOMS } from "./queries";


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

    generate_selected_rooms_arr = (rooms_arr) => {
        let final_selected_arr = []
        console.log(rooms_arr)
        //iterating through selected indexes
        for(let index of this.state.selected_set){
            final_selected_arr.push(rooms_arr[index])
        }

        console.log(final_selected_arr)

    }

    render(){
        return(
            <TouchableWithoutFeedback
                onPress={()=>{
                    Keyboard.dismiss()
                }}
            >
                <Query
                    query={GET_NOT_JOINED_ROOMS}
                >
                    {({loading, error, data})=>{
                        if (loading){
                            return <Text>LOADING.....</Text>
                        }

                        if (error){
                            return <Text>Error thrown.....</Text>
                        }

                        if (data){
                            return(
                                <View style={styles.main_container}>
                                    <FlatList
                                        data={data.get_not_joined_rooms}
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
                                        onPress={()=>{this.generate_selected_rooms_arr(data.get_not_joined_rooms)}}
                                    >
                                        <Text style={{color:"white"}}>
                                            nextdawdadawdadadaw
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    }}
                </Query>
            </TouchableWithoutFeedback>
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