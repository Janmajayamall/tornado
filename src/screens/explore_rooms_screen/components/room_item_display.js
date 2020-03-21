import React from "react"
import { 
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import {
    Mutation,
    ApolloConsumer
} from "react-apollo"
import {Navigation} from "react-native-navigation"

//importing base style 
import base_style from "./../../../styles/base"

//importing helpers
import {get_relative_time_ago} from "./../../../helpers"

class RoomItemDisplay extends React.PureComponent{

    constructor(props){
        super(props)

        this.state = {
            selected:false
        }

    }

    get_relative_time_ago = (timestamp) => {
        return get_relative_time_ago(timestamp)
    }

    select_room = () => {        
        this.setState((prev_state)=>{

            if (!prev_state.selected){
                this.props.add_to_set(this.props.index)
            }else{
                this.props.remove_from_set(this.props.index)
            }
           
            return({
                selected:!prev_state.selected
            })
        })
    }
    
    render(){
        return(
            <TouchableOpacity 
                onPress={this.select_room}
                style={{width:"100%"}}
                >
                    <View style={styles.main_container}>
                        <View style={[styles.description_container, {backgroundColor:!this.state.selected?base_style.color.primary_color:base_style.color.primary_color_lighter}]}>
                            <View>
                                <Text style={styles.room_name_text}>
                                    {this.props.room_object.name}
                                </Text>
                            </View>
                            <View style={styles.room_attribute_container}>
                                <Text style={styles.room_attributes_text}>
                                    {"This is a group for people, feel free to join"}
                                </Text>
                                <Text style={[styles.room_attributes_text, {fontStyle:"italic", marginTop:5}]}>
                                    {`created ${this.get_relative_time_ago(this.props.room_object.timestamp)}`}
                                </Text>
                            </View>
                            
                        </View>
                        {/* <View style={styles.button_container}>
                            <Text style={styles.button_text}>
                                JOIN
                            </Text>
                        </View> */}
                    </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-between",
    }, 
    room_name_text:{
        ...base_style.typography.medium_header
    },
    room_attributes_text:{
        ...base_style.typography.small_font_paragraph
    },
    description_container:{
        width:"100%",
        padding:20
    },
    name_container:{
       
    },
    room_attribute_container:{
        marginTop:5
    },
    // button_container:{
    //     width:"30%",
    //     justifyContent:"center",
    //     alignItems:"center",
    //     borderColor:base_style.color.secondary_color,
    //     borderWidth:10
    // },
    // button_text:{
    //     ...base_style.typography.small_header
    // }
})

export default RoomItemDisplay