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
import ErrorComponent from "./../../../custom_components/loading/error_component"

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
        console.log("query comments you fool")
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
                                refetch={refetch}
                                network_status={networkStatus}
                                bottom_padding={this.props.bottom_padding}
                                componentId={this.props.componentId}
                            />
                        )

                    }   
                    
                    if(!!error){
                        return(
                            <ErrorComponent
                                retry={()=>{
                                    refetch()
                                }}
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