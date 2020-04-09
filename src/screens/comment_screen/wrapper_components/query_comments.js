import React from "react"
import {
    Text
} from "react-native"
import {
    Query
} from "react-apollo"
import PropTypes from "prop-types"

//importing custom components
import CommentList from "../../../custom_components/comments/comment_list"
import Loader from "./../../../custom_components/loading/loading_component"

//importing queries
import {
    GET_POST_COMMENTS,
    GET_POST_CAPTIONS
} from "./../../../apollo_client/apollo_queries/index"
import { constants } from "../../../helpers"

class QueryComments extends React.PureComponent{

    static propTypes = {
        post_object:PropTypes.object,
        query_type:PropTypes.string,
        bottom_padding:PropTypes.any,
        componentId:PropTypes.any
    }

    constructor(props){
        super(props)
        this.state = {

        }

        console.log(this.props, "query_comments props")
    }

    get_query = () => {

        if(this.props.query_type===constants.comment_list_query_type.caption_query){
            return GET_POST_CAPTIONS
        }

        if(this.props.query_type===constants.comment_list_query_type.comment_query){
            return GET_POST_COMMENTS
        }

    }

    get_variables = () => {
        if(this.props.query_type===constants.comment_list_query_type.caption_query){
            return({
                post_id:this.props.post_object._id
            })
        }

        if(this.props.query_type===constants.comment_list_query_type.comment_query){
            return({
                content_id:this.props.post_object._id,
                content_type:this.props.post_object.post_type,
            })
        }

    }

    render(){
        return(
            <Query
                query={this.get_query()}
                variables={this.get_variables()}
                fetchPolicy={"cache-and-network"}
            >
                {({loading, error, data, refetch, networkStatus}) => {

                    //render comment list when data is not undefined
                    if(data){
                        //getting data array
                        const data_array = data[`${Object.keys(data)[0]}`]                    
                        return(
                            <CommentList
                                comment_list={data_array ? data_array : []}
                                post_object={this.props.post_object}
                                query_type={this.props.query_type}
                                error={error}
                                loading={loading}
                                refetch={refetch}
                                network_status={networkStatus}
                                bottom_padding={this.props.bottom_padding}
                                componentId={this.props.componentId}
                            />
                        )

                    }   
                    
                    //otherwise keep loading
                    return(
                        <Loader/>
                    )

                }}
            </Query>
        )
    }
}


export default QueryComments