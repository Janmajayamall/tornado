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

//importing queries and mutations
import {  
    TOGGLE_FOLLOW_ROOM, 
    GET_ROOM_DEMOGRAPHICS,
    GET_ROOM_FEED,
    GET_ALL_JOINED_ROOMS
} from "./../../../apollo_client/apollo_queries/index";

//importing base style 
import base_style from "./../../../styles/base"

//importing helpers
import {get_relative_time_ago, constants} from "./../../../helpers/index"

//importing custom components
import BigButton from "./../../../custom_components/buttons/big_buttons"
import ProfileImage from "./../../../custom_components/image/profile_image"
import HyperLinkText from "./../../../custom_components/text/hyper_link_text"

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

    toggle_join = async() => {  
        try{

            //generating toggle variables
            const variables = {
                room_id:this.props.room_object._id,   
                status:this.props.room_object.user_follows?constants.status.not_active:constants.status.active        
            }
            
            const data = await this.props.client.mutate({
                mutation:TOGGLE_FOLLOW_ROOM,
                variables:variables,
                optimisticResponse:()=>{
                    let optimistic_response = {
                        __typename:"Mutation",
                        toggle_follow_room:{
                            room_id: this.props.room_object._id,
                            status:variables.status,
                            __typename: "Follow_room"    
                        }
                    }
                    return optimistic_response
                },
                update:(cache, {data})=>{

                    //reaching caption objects for the post from cache
                    const {get_room_demographics} = cache.readQuery({
                        query:GET_ROOM_DEMOGRAPHICS,
                        variables:{
                            room_id:this.props.room_object._id
                        }
                    })

                    //getting toggle_follow status output
                    const {toggle_follow_room} = data

                    const updated_room_demographics = {
                        ...get_room_demographics
                    }

                    //updating user_follows object of the cached room_demographics of the data. 
                    // Note that if status and user_follows on the same page then don't update it
                    if(toggle_follow_room.status===constants.status.active){
                        if(updated_room_demographics.user_follows===true){ // if user_follows is already true (i.e. ACTIVE) then return
                            return
                        }
                        //change the user_follows to true
                        updated_room_demographics.user_follows=true
                        updated_room_demographics.room_members_count+=1
                    }else{
                        if(updated_room_demographics.user_follows===false){ //if user_follows is already false, return
                            return
                        }
                        //change the user_follows to false
                        updated_room_demographics.user_follows=false
                        updated_room_demographics.room_members_count-=1
                    }
                

                    //writing it to the cache
                    cache.writeQuery({
                        query:GET_ROOM_DEMOGRAPHICS,
                        variables:{
                            room_id:this.props.room_object._id
                        },
                        data:{
                            get_room_demographics:updated_room_demographics
                        }
                    })
     
                },
                refetchQueries:[
                    {
                        query:GET_ROOM_FEED,
                        variables:{
                            limit:constants.apollo_query.pagination_limit
                        }
                    },
                    {
                        query:GET_ALL_JOINED_ROOMS,
                        variables:{}
                    }
                ]
            })
        }catch(e){
            
        }
    }   
    
    render(){
        return(

                    <View style={styles.main_container}>

                        <View style={styles.first_container}>    
                            <Text numberOfLines={1} style={styles.room_name_text}>
                                {this.props.room_object.name}
                            </Text>
                        </View>

                        <View style={styles.second_container}>
                            <HyperLinkText 
                                style={styles.description_text}
                                trim={true}
                                numberOfLines={5}
                            >
                                {this.props.room_object.description}
                            </HyperLinkText>
                        </View>

                        <View style={styles.third_container}>
                            <View style={styles.second_container_first_col}>
                                <Text style={[styles.description_text, {}]}>
                                    {`${this.props.room_object.room_members_count} ${this.props.room_object.room_members_count===1?"member":"members"}`}
                                </Text>
                            </View> 
                            <View style={styles.second_container_second_col}>
                                <Text style={[styles.description_text, {}]}>
                                    {`created ${get_relative_time_ago(this.props.room_object.timestamp)}`}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.fourth_container}
                            onPress={this.props.navigate_to_creator_profile}
                        >
                            <View style={styles.creator_first_col}>
                                <Text style={[styles.description_text]}>
                                    {`created by: ${this.props.room_object.creator_info.username}`}
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
                                active={!this.props.room_object.user_follows}
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
        ...base_style.typography.small_header,
    },
    description_text:{
        ...base_style.typography.small_font_paragraph,
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