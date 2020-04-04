import React from "react"
import { 
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from "react-native";
import {
    Mutation,
    ApolloConsumer,
    withApollo
} from "react-apollo"
import {Navigation} from "react-native-navigation"
import PropTypes from "prop-types"

//importing base style 
import base_style from "./../../../styles/base"

//importing helpers
import {get_relative_time_ago} from "./../../../helpers/index"

//importing custom components
import BigButton from "./../../../custom_components/buttons/big_buttons"
import ProfileImage from "./../../../custom_components/image/profile_image"

const window = Dimensions.get("window")
class RoomDetailsPanel extends React.PureComponent{

    static propTypes = {
        room_object:PropTypes.object,
        navigate_to_creator_profile:PropTypes.func
    }

    constructor(props){
        super(props)

        this.state = {
        }

    }

    get_relative_time_ago = (timestamp) => {
        return get_relative_time_ago(timestamp)
    }

    toggle_join = () => {  
        
    }   
    
    render(){
        return(

                    <View style={styles.main_container}>

                        <View style={styles.first_container}>    
                            <Text style={styles.room_name_text}>
                                {this.props.room_object.name}
                            </Text>
                        </View>

                        <View style={styles.second_container}>
                            <Text style={styles.description_text}>
                                {this.props.room_object.description}
                            </Text>
                        </View>

                        <View style={styles.third_container}>
                            <View style={styles.second_container_first_col}>
                                <Text style={[styles.description_text, {}]}>
                                    {`${this.props.room_object.room_members_count} ${this.props.room_object.room_members_count===1?"member":"members"}`}
                                </Text>
                            </View> 
                            <View style={styles.second_container_second_col}>
                                <Text style={[styles.description_text, {}]}>
                                    {`Created ${get_relative_time_ago(this.props.room_object.timestamp)}`}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.fourth_container}
                            onPress={this.props.navigate_to_creator_profile}
                        >
                            <View style={styles.creator_first_col}>
                                <Text style={[styles.description_text, {fontStyle:"italic"}]}>
                                    {`Created By: ${this.props.room_object.creator_info.username}`}
                                </Text>
                            </View> 
                            <View style={styles.creator_second_col}>
                                <ProfileImage
                                    width={window.width*0.15}
                                    image_object={this.props.room_object.creator_info.avatar}
                                    default_avatar={this.props.room_object.creator_info.default_avatar}
                                />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.join_button_container}>
                            <BigButton
                                onPress={this.toggle_join}
                                button_text={this.props.room_object.user_follows?"Leave the room":"Join Room"}
                            />
                        </View>

                    </View>

        )
    }
}

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        width:"100%",
        padding:10
    }, 
    first_container:{
        width:"100%",
    },
    second_container:{
        width:"100%",
        marginTop:10
    },
    third_container:{
        width:"100%",
        flexDirection:"row",
        marginTop:10,
        justifyContent:"space-between"
    },
    fourth_container:{
        width:"100%",
        flexDirection:"row",
        marginTop:10,
    },
    second_container_first_col:{
        // width:"50%",
        // justifyContent:"center",
        // alignItems:"center"
    },
    second_container_second_col:{
        // width:"50%",
        // justifyContent:"center",
        // alignItems:"center"
    },
    room_name_text:{
        ...base_style.typography.medium_header,
    },
    description_text:{
        ...base_style.typography.small_font_paragraph,
        fontWeight:"bold"
    },
    creator_first_col:{
        width:"70%",
        justifyContent:"center"
    },
    creator_second_col:{
        width:"30%",
        alignItems:"flex-end"
    },
    join_button_container:{
        width:"100%",
        marginTop:10
    }
})

export default withApollo(RoomDetailsPanel)