// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'
import PieChart from '../PieChart'
import './index.css'

const teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/'

class TeamMatches extends Component {
  state = {
    isLoading: true,
    recentMatchesData: {},
  }

  componentDidMount() {
    this.getRecentMatches()
  }

  setRecentMatches = (updatedData, isLoading) => {
    this.setState({recentMatchesData: updatedData, isLoading})
  }

  getRecentMatches = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`${teamMatchesApiUrl}${id}`)
    const data = await response.json()
    const updatedData = {
      teamBannerUrl: data.team_banner_url,
      latestMatch: {
        umpires: data.latest_match_details.umpires,
        result: data.latest_match_details.result,
        manOfTheMatch: data.latest_match_details.man_of_the_match,
        id: data.latest_match_details.id,
        date: data.latest_match_details.date,
        venue: data.latest_match_details.venue,
        competingTeam: data.latest_match_details.competing_team,
        competingTeamLogo: data.latest_match_details.competing_team_logo,
        firstInnings: data.latest_match_details.first_innings,
        secondInnings: data.latest_match_details.second_innings,
        matchStatus: data.latest_match_details.match_status,
      },
      recentMatches: data.recent_matches.map(recentMatch => ({
        umpires: recentMatch.umpires,
        result: recentMatch.result,
        manOfTheMatch: recentMatch.man_of_the_match,
        id: recentMatch.id,
        date: recentMatch.date,
        venue: recentMatch.venue,
        competingTeam: recentMatch.competing_team,
        competingTeamLogo: recentMatch.competing_team_logo,
        firstInnings: recentMatch.first_innings,
        secondInnings: recentMatch.second_innings,
        matchStatus: recentMatch.match_status,
      })),
    }
    this.setRecentMatches(updatedData, false)
  }

  renderRecentMatchesList = () => {
    const {recentMatchesData} = this.state
    const {recentMatches} = recentMatchesData

    return (
      <ul className="recent-matches-list">
        {recentMatches.map(recentMatch => (
          <MatchCard matchData={recentMatch} key={recentMatch.id} />
        ))}
      </ul>
    )
  }

  getNoOfMatches = value => {
    const {recentMatchesData} = this.state
    const {latestMatch, recentMatches} = recentMatchesData
    const currentMatch = value === latestMatch.matchStatus ? 1 : 0
    const result =
      recentMatches.filter(match => match.matchStatus === value).length +
      currentMatch
    return result
  }

  generatePieChartData = () => [
    {name: 'Won', value: this.getNoOfMatches('Won')},
    {name: 'Lost', value: this.getNoOfMatches('Lost')},
    {name: 'Drawn', value: this.getNoOfMatches('Drawn')},
  ]

  renderTeamMatches = () => {
    const {recentMatchesData} = this.state
    const {teamBannerUrl, latestMatch} = recentMatchesData

    return (
      <div className="team-matches-container">
        <img src={teamBannerUrl} className="team-banner" alt="team banner" />
        <LatestMatch latestMatchData={latestMatch} />
        <h1 className="latest-match-heading mt-3">Team Statistics</h1>
        <PieChart data={this.generatePieChartData()} />
        {this.renderRecentMatchesList()}
        <Link to="/">
          <button type="button" className="btn btn-outline-info mb-2">
            Back
          </button>
        </Link>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height="50" />
    </div>
  )

  getRouteClassName = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    switch (id) {
      case 'RCB':
        return 'rcb'
      case 'KKR':
        return 'kkr'
      case 'KXP':
        return 'kxp'
      case 'CSK':
        return 'csk'
      case 'RR':
        return 'rr'
      case 'MI':
        return 'mi'
      case 'SRH':
        return 'srh'
      case 'DC':
        return 'dc'
      default:
        return ''
    }
  }

  render() {
    const {isLoading} = this.state
    const className = `team-matches-route-container ${this.getRouteClassName()}`

    return (
      <div className={className}>
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}

export default TeamMatches
