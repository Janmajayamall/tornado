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
    TOGGLE_VOTE
} from "./../../apollo_client/apollo_queries/index";


class VotingPanel extends React.PureComponent{

    static propTypes = {
        caption_object:PropTypes.object
    }
    
    constructor(props){
        super(props)
        this.state = {
        }
    }

    toggle_user_vote = () => {

        const data = this.props.client.mutate({
            mutation:TOGGLE_VOTE,
            variables:{
                content_id:this.props.caption_object.content_id,
                vote_type:"w",//TODO: get it from somewhere,
                content_type:this.props.caption_object.content_type
            }
        })

    }

    render(){
        return(
            <View style={styles.main_container}>
                <Text
                    style={base_style.typography.mini_font}

                >
                    {this.props.caption_object.up_votes_count}
                </Text>
                <Text style={base_style.typography.mini_font}>
                    {"  &&&  "}
                </Text>
                <Text style={base_style.typography.mini_font}>
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
