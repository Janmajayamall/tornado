
import React from "react"
import { 
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Dimensions,
    FlatList
} from "react-native";
import {
    Mutation,
    ApolloConsumer,
    withApollo
} from "react-apollo"
import {Navigation} from "react-native-navigation"
import Icon from 'react-native-vector-icons/AntDesign';


//importing custom components
import ListItemDivider from "./../../custom_components/common_decorators/list_item_divider"
import Loader from "./../../custom_components/loading/loading_component"
import RoomItemDisplay from "./../../custom_components/room_display/room_item_display"

//importing base style 
import base_style from "../../styles/base"

//importing helpers
import {  
} from "./../../helpers/index";

//importing all screens
import { 
    ROOM_DETAILS_SCREEN
 } from "../../navigation/screens";
import {
    navigation_push_to_screen
} from "./../../navigation/navigation_routes/index"

//importing queries and mutations
import {  
    GET_ROOMS,
} from "./../../apollo_client/apollo_queries/index";
import PropTypes from "prop-types"

const window = Dimensions.get("window")

class SearchRooms extends React.PureComponent{

    static propsTypes={
    }

    constructor(props){
        super(props)

        this.state = {
            loading:true,
            error:false,
            no_result:false,

            //search
            name_filter:"",
            rooms_list:[]
        }

        this.get_room_results()
    }


    get_room_results = async(name_filter="") => {
        
        try{
            const {data} = await this.props.client.query({
                query:GET_ROOMS,
                variables:{
                    name_filter:name_filter.trim()
                }
            })
            const {get_rooms} = data
            
            //setting the list on the state
            this.setState({
                rooms_list:get_rooms,
                loading:false,
                no_result:get_rooms.length===0
            })
        }catch(e){
            this.setState({error:true})
        }
    }
    
    search_input_changed = (val) => {
        this.setState({
            name_filter:val,
            loading:true
        })
        this.get_room_results(val)
    }

    navigate_to_room_details = (room_object) => {
        navigation_push_to_screen(this.props.componentId, {
            screen_name:ROOM_DETAILS_SCREEN,
            props:{
                room_id:room_object._id
            }
        })
    }

    render(){
        return(
            <TouchableWithoutFeedback 
                    onPress={()=>{
                        Keyboard.dismiss()
                    }}
                >
                <SafeAreaView 
                    style={styles.main_container}
                >   

                    <View style={styles.search_bar_container}>
                        <View style={styles.search_icon_container}>
                            <Icon name="search1" size={base_style.icons.icon_size} color={base_style.color.icon_selected}/> 
                        </View>
                        <View style={styles.search_text_input_container}>
                            <TextInput                    
                                placeholder={"Search rooms..."}
                                style={styles.search_text_input}
                                placeholderTextColor={base_style.typography.font_colors.text_input_placeholder}
                                onChangeText={this.search_input_changed}
                                value={this.state.name_filter}
                            />        
                        </View>        
                    </View>
                    <ListItemDivider/> 

                    {
                        this.state.loading===true?

                            <Loader/>:

                                //if the room_list is empty, that is no result is true
                                this.state.no_result===true ?
                                <View style={styles.no_result_container}>
                                    <Text style={[base_style.typography.medium_header, {...base_style.typography.font_colors.low_emphasis}]}>
                                        Sorry no such rooms
                                    </Text>
                                </View>:
                                // if loading is false && no_result is false 
                                <FlatList
                                    data={this.state.rooms_list}
                                    renderItem={(object)=>{
                                        return(
                                                <RoomItemDisplay
                                                    room_object={object.item}
                                                    index={object.index}
                                                    add_to_set={()=>{}}
                                                    remove_from_set={()=>{}}
                                                    selected={false}
                                                    selection_allowed={false}
                                                    selection_on_press_sub={()=>{
                                                        this.navigate_to_room_details(object.item)
                                                    }}
                                                />              
                                        )
                                    }}
                                    ItemSeparatorComponent={()=> {
                                        return <ListItemDivider/>
                                    }}
                                    
                                />                

                    }

                </SafeAreaView>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    main_container:{
        backgroundColor:base_style.color.primary_color,
        flex:1
    }, 
    search_bar_container:{
        flexDirection:"row",
        padding:10,
        width:"100%"
    },
    search_text_input_container:{
        width:"90%"
    },
    search_text_input:{
        // width:"100%",
        ...base_style.typography.medium_font,
        // paddingLeft:10,
    },
    no_result_container:{
        justifyContent:"center",
        alignItems:"center",
        flex:1
    },
    search_icon_container:{
        width:"10%",
        justifyContent:"center"
    }

})

export default withApollo(SearchRooms)

//TODO: shift the share button to top right on the navigator bar, because it is more UI friendly