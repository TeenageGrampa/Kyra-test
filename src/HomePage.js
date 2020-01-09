import React, {Component} from 'react'

const APIKEY = 'AIzaSyBP5wlr0EnY55mkQplDqUgtjqmOEw78-Zg'
const chanId = 'UCvO6uJUVJQ6SrATfsWR5_aA'


class HomePage extends Component {

    state = {
        videos: []
    }
    
    async componentDidMount(){
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${APIKEY}&channelId=${chanId}&part=snippet,id&order=date&maxResults=10`)
        const ytjson = await res.json()
        this.setState({
            videos: ytjson.items
        })
    }

    displayvideos = () => {
        if(this.state.videos){
            const videos = this.state.videos.map( video => 
            <div>
                <img src={video.snippet.thumbnails.default.url} />
                <p>{video.snippet.title}</p>
            </div>)
            return videos
        } else {
            return <p>One second while we load the content</p>
        }
    }

    render(){
        console.log(this.state)
        return(
            <div>
                {this.displayvideos()}
            </div>
        )
    }
}

export default HomePage;