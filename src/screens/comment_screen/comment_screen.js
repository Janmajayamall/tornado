import React from 'react'
import { connect } from 'react-redux'
import {
    View,
    StyleSheet,
    Text,
    ScrollView

} from 'react-native'
import base_style from './../../styles/base'
import gql from 'graphql-tag';
import {
    Query,
    Mutation
} from 'react-apollo'

//importing queries/mutations in gql
import {CREATE_COMMENT, GET_POST_COMMENTS} from './queries/index'

//importing components 
import ContentBox from "./../../custom_components/content_list/content_box"
import CommentList from "./../../custom_components/comments/comment_list"

class Comment extends React.PureComponent {

    constructor(props){
        super(props)
    
        this.state = {

        }

        console.log(this.props.post_object)
        
    }


    render(){
        return(

            <View>
                <Query
                    query={GET_POST_COMMENTS}
                    variables={{
                        content_id:this.props.post_object._id,
                        content_type:"ROOM_POST", //TODO: make it dynamic
                    }}
                >
                    {({loading, error, data}) => {
                        console.log(error)
                        
                        return(
                            <CommentList
                                comment_list={data ? data.get_post_comments : []}
                                post_object={this.props.post_object}
                                error={error}
                                loading={loading}
                            />
                        )

                    }}
                </Query>
            
            </View>

        )
    }

}   

const styles = StyleSheet.create({

})

export default connect(undefined,  undefined)(Comment)