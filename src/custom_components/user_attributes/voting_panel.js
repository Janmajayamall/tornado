import React from "react"
import {  
    StyleSheet,
    View,
    Text,
    TouchableOpacity,

} from "react-native";
import { 
    withApollo
 } from "react-apollo";
import base_style from "./../../styles/base"
import PropTypes from "prop-types"
import Icon from "react-native-vector-icons/AntDesign"

//importing queries/mutations
import {  
    TOGGLE_VOTE,
    GET_POST_CAPTIONS
} from "./../../apollo_client/apollo_queries/index";
import { constants } from "../../helpers";


class VotingPanel extends React.PureComponent{

    static propTypes = {
        caption_object:PropTypes.object,
    }
    
    constructor(props){
        super(props)
        this.state = {
        }
    }

    componentDidUpdate(){
    }

    toggle_user_vote = async(vote_type) => {

        //checking for repetitive calls
        if(this.props.caption_object.user_vote_object && this.props.caption_object.user_vote_object.vote_type===vote_type){
            return
        }


        const data = await this.props.client.mutate({
            mutation:TOGGLE_VOTE,
            variables:{
                content_id:this.props.caption_object._id,
                vote_type:vote_type,
                content_type:"CAPTION"
            },
            optimisticResponse:()=>{
                let optimistic_response = {
                    __typename:"Mutation",
                    toggle_vote:{
                        _id:new Date().toISOString(),
                        content_id:this.props.caption_object._id,
                        vote_type:vote_type,
                        __typename:"Vote"
                    }
                }
                return optimistic_response
            },
            update:(cache, {data})=>{

                //getting toggle vote result
                const toggle_result = data.toggle_vote                

                //reaching caption objects for the post from cache
                const {get_post_captions} = cache.readQuery({
                    query:GET_POST_CAPTIONS,
                    variables:{
                        post_id:this.props.caption_object.post_id,    
                    }
                })                                

                //updating the vote of the specific caption_object
                const updated_post_captions = []
                get_post_captions.forEach(caption=>{

                    if(caption._id===toggle_result.content_id){
                        //update the specific caption
                        let new_post_caption = {
                            ...caption,
                        }

                        //updating user_vote_object 
                        new_post_caption.user_vote_object=toggle_result
                        
                        //changing the vote counts
                        if(toggle_result.vote_type===constants.vote_type.up){
                            new_post_caption.up_votes_count+=1
                            //only if user had chosen down before
                            if(caption.user_vote_object){
                                new_post_caption.down_votes_count-=1
                            }
                        }
                        else if(toggle_result.vote_type===constants.vote_type.down){                                
                            new_post_caption.down_votes_count+=1
                            //only if user had chosen up before
                            if(caption.user_vote_object){
                                new_post_caption.up_votes_count-=1
                            }                                
                        }
                        
                        //pushing it into updated_post_captions
                        updated_post_captions.push(new_post_caption)

                    }else{
                        updated_post_captions.push(caption)
                    }
                })
                
                //writing it to the cache
                cache.writeQuery({
                    query:GET_POST_CAPTIONS,
                    variables:{
                        post_id:this.props.caption_object.post_id
                    },
                    data:{
                        get_post_captions:updated_post_captions
                    }
                })
    
            }
        })    
    }

    generate_icon(icon_vote_type){

        if(icon_vote_type===constants.vote_type.up){
            if(this.props.caption_object.user_vote_object && this.props.caption_object.user_vote_object.vote_type===constants.vote_type.up){
                return (
                    <Icon
                        name="upcircleo"
                        size={base_style.icons.icon_size}
                        color={base_style.color.icon_selected}
                    />
                )
            }else{
                return (
                    <Icon
                        name="upcircleo"
                        size={base_style.icons.icon_size}
                        color={base_style.color.icon_not_selected}
                    />
                )
            }
        }else{
            if(this.props.caption_object.user_vote_object && this.props.caption_object.user_vote_object.vote_type===constants.vote_type.down){
                return(
                    <Icon
                        name="downcircleo"
                        size={base_style.icons.icon_size}
                        color={base_style.color.icon_selected}
                    />
                )
            }else{
                return(
                    <Icon
                        name="downcircleo"
                        size={base_style.icons.icon_size}
                        color={base_style.color.icon_not_selected}
                    />
                )
            }
        }

    }

    render(){
        return(
            <View style={styles.main_container}>
                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity
                        onPress={()=>{this.toggle_user_vote(constants.vote_type.up)}}
                        style={styles.icons_container}
                    >
                        {
                            this.generate_icon(constants.vote_type.up)
                        }
                    </TouchableOpacity>
                    <Text
                        style={styles.count_text}                        
                    >
                        {this.props.caption_object.up_votes_count}
                    </Text>
                </View>
                
                <Text style={[base_style.typography.small_font, {alignSelf:"flex-start"}]}>
                    {"        "}
                </Text>

                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity
                        onPress={()=>{this.toggle_user_vote(constants.vote_type.down)}}
                        style={styles.icons_container}
                    >
                        {
                            this.generate_icon(constants.vote_type.down)
                        }
                    </TouchableOpacity>
                    <Text 
                        style={styles.count_text}                        
                    >
                        {this.props.caption_object.down_votes_count}
                    </Text>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    main_container:{
        width:"100%",
        flexDirection:'row'
    },
    icons_container:{
        alignItems:"center", 
        justifyContent:"center"
    },
    count_text:{
        ...base_style.typography.small_font,
        padding:5, 
        alignSelf:"center"
    }
})

export default withApollo(VotingPanel)
