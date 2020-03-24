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
import {get_relative_time_ago} from "./../../../helpers/index"

//importing custom components
import BigButton from "./../../../custom_components/buttons/big_buttons"

class RoomDetailsPanel extends React.PureComponent{

    constructor(props){
        super(props)

        this.state = {
        }

    }

    get_relative_time_ago = (timestamp) => {
        return get_relative_time_ago(timestamp)
    }

    
    render(){
        return(

                    <View style={styles.main_container}>

                        <View style={styles.first_container}>    
                            <Text style={styles.room_name_text}>
                                This is a new room
                            </Text>
                        </View>

                        <View style={styles.second_container}>
                            <Text style={styles.description_text}>
                                C'mon join the room and enjoy everything
                            </Text>
                        </View>

                        <View style={styles.third_container}>
                            <View style={styles.second_container_first_col}>
                                <Text style={[styles.description_text, {fontStyle:"italic"}]}>
                                    120 Members
                                </Text>
                            </View> 
                            <View style={styles.second_container_second_col}>
                                <Text style={[styles.description_text, {fontStyle:"italic"}]}>
                                    Created 10m ago
                                </Text>
                            </View>
                        </View>

                        <View style={styles.fourth_container}>
                            <BigButton
                                onPress={()=>{console.log('hua')}}
                                button_text={"Join the room"}
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
        marginTop:10
    },
    fourth_container:{
        width:"100%",
        marginTop:10
    },
    second_container_first_col:{
        width:"50%",
        // justifyContent:"center",
        // alignItems:"center"
    },
    second_container_second_col:{
        width:"50%",
        // justifyContent:"center",
        // alignItems:"center"
    },
    room_name_text:{
        ...base_style.typography.medium_header,
    },
    description_text:{
        ...base_style.typography.small_font_paragraph,
        fontWeight:"bold"
    }
})

export default RoomDetailsPanel