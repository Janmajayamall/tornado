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
import PropTypes from "prop-types"

//importing base style 
import base_style from "./../../styles/base"

//importing helpers
import {get_relative_time_ago} from "./../../helpers/index"

class RoomItemDisplay extends React.PureComponent{

    static propTypes = {
        add_to_set:PropTypes.func,
        remove_from_set:PropTypes.func,
        index:PropTypes.any,
        room_object:PropTypes.object,
        selected:PropTypes.bool,
        selection_allowed:PropTypes.bool,

        //if selection_allowed is false, then onPress function should be supplied
        selection_on_press_sub:PropTypes.func
    }

    constructor(props){
        super(props)

        this.state = {
            selected:this.props.selected
        }

    }

    get_relative_time_ago = (timestamp) => {
        return get_relative_time_ago(timestamp)
    }

    select_room = () => {        
        this.setState((prev_state)=>{

            if (!prev_state.selected){
                this.props.add_to_set(this.props.room_object._id)
            }else{
                this.props.remove_from_set(this.props.room_object._id)
            }
           
            return({
                selected:!prev_state.selected
            })
        })
    }
    
    render(){
        return(
            <TouchableOpacity 
                onPress={()=>{
                    if(this.props.selection_allowed){
                        this.select_room()
                        return
                    }
                    this.props.selection_on_press_sub()
                }}
                style={{width:"100%"}}
                >
                    <View style={styles.main_container}>
                        <View style={[styles.description_container,this.state.selected ? {backgroundColor:base_style.color.primary_color_lighter, borderWidth:2, borderColor:base_style.color.icon_selected, elevation:10, borderRadius:20}: {backgroundColor:base_style.color.primary_color}]}>
                            <Text numberOfLines={1} style={styles.room_name_text}>
                                {this.props.room_object.name}
                            </Text>                
                            <Text numberOfLines={3} style={[styles.room_attributes_text,{marginTop:5}]}>
                                {this.props.room_object.description}
                            </Text>      
                            <View style={styles.members_timestamp_container}>
                                <Text style={styles.room_attributes_text}>
                                {`${this.props.room_object.room_members_count} members`}
                                </Text>
                                <Text style={{...styles.room_attributes_text, ...base_style.typography.font_colors.low_emphasis}}>
                                    {`created ${this.get_relative_time_ago(this.props.room_object.timestamp)}`}
                                </Text>
                            </View>                                                      
                            <Text numberOfLines={1} style={[styles.room_attributes_text, {marginTop:5}]}>
                                {`creator: ${this.props.room_object.creator_info.username}`}
                            </Text>
                            {
                                this.props.room_object.user_follows ?
                                    <Text style={{...styles.room_attributes_text, ...base_style.typography.font_colors.low_emphasis, alignSelf:"flex-end"}}>
                                        {`Member`}
                                    </Text>:
                                    undefined
                            }
                                                                            
                        </View>
                    </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        width:"100%",
        // flexDirection:"row",
        // justifyContent:"space-between",
    }, 
    room_name_text:{
        ...base_style.typography.small_header
    },
    room_attributes_text:{
        ...base_style.typography.small_font_paragraph
    },
    description_container:{
        width:"100%",
        padding:20
    },
    username_container:{
        flexDirection:"row",
        justifyContent:"space-between"
    },
    members_timestamp_container:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginTop:5
    }
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

// {backgroundColor:!this.state.selected?base_style.color.primary_color:base_style.color.primary_color_lighter}