import React, {Component} from 'react'
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';


const APIKEY = 'AIzaSyAteWLdNwrQ-w_5cbGkjQ8xeSlezu7QPL0'
const chanId = 'UCvO6uJUVJQ6SrATfsWR5_aA'


class HomePage extends Component {

    state = {
        videos: [],
        firstpage: true,
        nextpage: '',
        chartshown: false,
        modal: false
    }

    componentDidMount(){
        this.getData()
        this.showchart()
        setInterval(this.getData, 5000)
    }
    
    getData = async (pageNum) => {
        const token = pageNum
        if(this.state.firstpage === true){
            const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${APIKEY}&channelId=${chanId}&part=snippet,id&order=date&maxResults=50`)
        const ytjson = await res.json()
        this.setState({
            videos: ytjson.items,
            nextpage: ytjson.nextPageToken,
            chartdata: ytjson.items.map(video => video.snippet.publishedAt.substring(0, 10))
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
            return <p className="subtitle">One second while we load the content</p>
        }
    }

    showchart = async () => {
        const token = this.state.nextpage
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${APIKEY}&channelId=${chanId}&part=snippet,id&order=date&maxResults=50&pageToken=${token}`)    
        const ytjson = await res.json()
        const uploads2 = ytjson.items.map(video => video.snippet.publishedAt.substring(0, 10))
        const res2 = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${APIKEY}&channelId=${chanId}&part=snippet,id&order=date&maxResults=50&pageToken=${ytjson.nextPageToken}`) 
        const ytjson2 = await res2.json()
        const uploads3 = ytjson2.items.map(video => video.snippet.publishedAt.substring(0, 10))
        const uploadtimes = this.state.chartdata.concat(uploads2).concat(uploads3)
        const datearray = this.sortDates(uploadtimes)
        this.setState({
            chartdata: datearray
        })
    }

    sortDates = (dates) => {
        let groupedDates = dates.reduce(function(l, r) {
            let keyParts = r.split("-"),
                key = keyParts[1] + keyParts[0];
        
            if (typeof l[key] === "undefined") {
                l[key] = [];
            }
        
            l[key].push(r);
        
            return l;
        }, {});
        
        let result = Object.keys(groupedDates)
                            .sort(function(a, b) { return Number(a) - Number(b); })
                            .map(function(key) {
                                return groupedDates[key];
                            });
        result.length = 18
        const formattedDates = result.flat(1)
        return formattedDates.sort(function(a,b){
            return new Date(b) - new Date(a);
          })
        
    }

    toggleChart = () => {
        this.setState({
            chartshown: true
        })
    }

    getdates = () => {
        const numarr = this.countdates(this.state.chartdata)
        const datearr = Array.from(new Set(this.state.chartdata))
        const dateobjs = datearr.map(function(value, i) {
            return {date: value, count: numarr[i]};
        })
        return dateobjs
    }

    countdates = (array) => {
        let groupedDates = array.reduce(function(l, r) {
            let keyParts = r.split("-"),
                key = keyParts[1] + keyParts[0] + keyParts[2];
        
            if (typeof l[key] === "undefined") {
                l[key] = [];
            }
        
            l[key].push(r);
        
            return l;
        }, {});
        
        let result = Object.keys(groupedDates)
                            .sort(function(a, b) { return Number(a) - Number(b); })
                            .map(function(key) {
                                return groupedDates[key];
                            });
        return result.map(result => result.length)
    }

    showModal = (count, date) =>{
        this.setState({
            modal: true,
            count: count,
            date: date
        })
    }

    hideModal = () => {
        this.setState({
            modal: false
        })
    }

    render(){
        return(
            <div className="container">
                {this.state.modal === true ? 
                <div className="modal-background" style={{zIndex: 600, }} onClick={this.hideModal}>
                    <div className="modal-card" onClick={this.hideModal}>
                        <div className="modal-card-body" onClick={this.hideModal} style={{borderRadius: 15, marginTop: '25%'}}>
                            <p>Date: {this.state.date}</p>
                            <p>Count: {this.state.count}</p>
                        </div>
                    </div>
                </div>
                : null}
                <div style={{marginTop: 10}}>
                    <h1 className="title">PAQ's Channel</h1>
                    {this.state.chartshown ?
                    <div>
                    <h2>PAQ's uploads for the past 18 months</h2>
                    <CalendarHeatmap
                        startDate={new Date(this.state.chartdata[this.state.chartdata.length - 1])}
                        endDate={new Date(this.state.chartdata[0])}
                        values={this.getdates()}
                        classForValue={(value) => {
                            if (!value) {
                              return 'color-empty';
                            }
                            return `color-scale-${value.count}`;
                          }}
                        onClick={(value) => this.showModal(value.count, value.date)}
                        />
                    </div> 
                    : <button onClick={this.toggleChart} style={{margin: 5}}>Show Channel Analysis</button>}
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