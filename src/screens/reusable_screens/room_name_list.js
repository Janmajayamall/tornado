import React from "react"
import { 
    SafeAreaView, 
    FlatList, 
    TouchableOpacity,
    StyleSheet,
    View,
    Text
} from "react-native";
import { Navigation } from "react-native-navigation" 
import PropTypes from "prop-types"
import { withApollo } from "react-apollo";
import base_style from "./../../styles/base"

//Query & Mutation requests
import {  
    GET_ROOM_DEMOGRAPHICS
} from "../../apollo_client/apollo_queries/index";

//navigation functions
import {  
    navigation_push_to_screen
} from "../../navigation/navigation_routes/index";
import {  
    ROOM_DETAILS_SCREEN
} from "../../navigation/screens";

//importing helpers
import {  
    get_relative_time_ago
} from "./../../helpers/index";

//importing custom components
import ListItemDivider from "./../../custom_components/common_decorators/list_item_divider"

class RoomNameList extends React.PureComponent {

    static propTypes = {
        room_objects:PropTypes.array
    }

    constructor(props){
        super(props)
        this.state = {
            loading:false
        }
        console.log(this.props)
    }

    navigate_to_details_screen = async(room_id) => {

        navigation_push_to_screen(this.props.componentId, {
            screen_name:ROOM_DETAILS_SCREEN,
            props:{
                room_id:room_id
            }
        })

    }

    render_item = (object) => {
        console.log(object)
        return(
            <TouchableOpacity
                style={styles.list_main_container}
                onPress={()=>{
                    if(this.state.loading){
                        return
                    }
                    this.navigate_to_details_screen(object.item._id)
                }}
            >
                    <View styles={styles.room_object_container}>
                        <Text numberOfLines={4} style={styles.room_name_text}>
                            {object.item.name}
                        </Text>
                        <Text style={{...base_style.typography.small_font}}>
                            {`created ${get_relative_time_ago(object.item.timestamp)}`}
                        </Text>
                    </View>
            </TouchableOpacity>
        )
    }

    render(){
        return(
            <SafeAreaView style={styles.main_container}>
                <FlatList
                    data={this.props.room_objects}
                    renderItem={this.render_item}
                    ItemSeparatorComponent={()=> {
                        return <ListItemDivider/>
                    }}
                />
            </SafeAreaView>
        )
    }

}

export default withApollo(RoomNameList)

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        width:"100%",
        flex:1,
    }, 
    room_name_text:{
        ...base_style.typography.medium_font
    },
    list_main_container:{
        padding:10,
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    join_button_container:{
        width:"30%"
    },
    room_object_container:{
        width:"70%"
    }
})