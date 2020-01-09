import React, {Component} from 'react'

const APIKEY = 'AIzaSyBP5wlr0EnY55mkQplDqUgtjqmOEw78-Zg'
const chanId = 'UCvO6uJUVJQ6SrATfsWR5_aA'


class HomePage extends Component {

    state = {
        videos: [],
        firstpage: true,
        nextpage: ''
    }

    componentDidMount(){
        this.getData()
        setInterval(this.getData, 5000)
    }
    
    getData = async (pageNum) => {
        const token = pageNum
        if(this.state.firstpage === true){
            const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${APIKEY}&channelId=${chanId}&part=snippet,id&order=date&maxResults=50`)
        const ytjson = await res.json()
        this.setState({
            videos: ytjson.items,
            nextpage: ytjson.nextPageToken
        })
        } else if(this.state.firstpage === false){
            const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${APIKEY}&channelId=${chanId}&part=snippet,id&order=date&maxResults=50&pageToken=${token}`)
        const ytjson = await res.json()
        this.setState({
            videos: ytjson.items
        })
        }
    }

    nextPage = () => {
        this.setState({
            firstpage: false
        },() => this.getData(this.state.nextpage))
    }

    displayvideos = () => {
        if(this.state.videos){
            const videos = this.state.videos.map( video => 
            <div className="box column is-2" style={{margin: 7, borderRadius: 10}}>
                <img src={video.snippet.thumbnails.medium.url} />
                <p>{video.snippet.title}</p>
            </div>)
            return videos
        } else {
            return <p>One second while we load the content</p>
        }
    }

    render(){
        return(
            <div className="container">
                <div style={{marginTop: 10}}>
                    <h1 className="title">PAQ's Channel</h1>
                    <div className="columns is-multiline">
                        {this.displayvideos()}
                    </div>
                    <button onClick={this.nextPage}>Next Page</button>
                </div>
            </div>
        )
    }
}

export default HomePage;