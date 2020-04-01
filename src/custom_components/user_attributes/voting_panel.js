import React from "react"
import {  
    StyleSheet,
    View,
    Text,

} from "react-native";
import { 
    withApollo
 } from "react-apollo";
import base_style from "./../../styles/base"
import PropTypes from "prop-types"

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

        try{
            const data = await this.props.client.mutate({
                mutation:TOGGLE_VOTE,
                variables:{
                    content_id:this.props.caption_object._id,
                    vote_type:vote_type,
                    content_type:"CAPTION"
                },
                update:(cache, {data})=>{
                    const {get_post_captions} = cache.readQuery({
                        query:GET_POST_CAPTIONS,
                        variables:{
                            post_id:this.props.caption_object.post_id,    
                        }
                    })

                    //getting toggle vote result
                    const toggle_result = data.toggle_vote
                    
    
                    //checking if the toggle is in same state then no need to update it
                    if(this.props.caption_object.user_vote_object && this.props.caption_object.user_vote_object.vote_type===toggle_result.vote_type){
                        return
                    }
    
                    //updating the vote of the specific caption_object
                    const updated_post_captions = []
                    get_post_captions.forEach(caption=>{
    
                        if(caption._id===toggle_result.content_id){
                            //update the specific caption
                            let new_post_caption = {
                                ...caption,
                            }

                            //changing users vote type 
                            new_post_caption.user_vote_object.vote_type=toggle_result.vote_type
                            
                            //changing the vote counts
                            if(toggle_result.vote_type===constants.vote_type.up){
                                new_post_caption.up_votes_count+=1
                                //only if user had chosen down before
                                if(this.props.caption_object.user_vote_object){
                                    new_post_caption.down_votes_count-=1
                                }
                            }
                            else if(toggle_result.vote_type===constants.vote_type.down){                                
                                new_post_caption.down_votes_count+=1
                                //only if user had chosen up before
                                if(this.props.caption_object.user_vote_object){
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
        }catch(e){
            console.log(`Error in voting panel: ${e}`)
        }
    
    }

    render(){
        return(
            <View style={styles.main_container}>
                <Text
                    style={base_style.typography.mini_font}
                    onPress={()=>{this.toggle_user_vote(constants.vote_type.up)}}
                >
                    {this.props.caption_object.up_votes_count}
                </Text>
                <Text style={base_style.typography.mini_font}>
                    {"  &&&  "}
                </Text>
                <Text 
                    style={base_style.typography.mini_font}
                    onPress={()=>{this.toggle_user_vote(constants.vote_type.down)}}
                >
                    {this.props.caption_object.down_votes_count}
                </Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    main_container:{
        width:"100%",
        flexDirection:'row'
    }
})

export default withApollo(VotingPanel)
