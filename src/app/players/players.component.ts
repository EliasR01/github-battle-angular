import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { timeStamp } from 'console';

const getUserInfo = gql`
  query getUser($login: String!) {
    user(login: $login) {
      login
      name
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories {
        totalCount
      }
      avatarUrl
    }
  }
`;

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent implements OnInit {
  private query: QueryRef<any>;

  player1Data: any;
  player2Data: any;
  player1: string = this.player1Data ? this.player1Data.user.login : 'Player 1';
  player2: string = this.player2Data ? this.player2Data.user.login : 'Player 2';
  player1Wins: string;
  player2Wins: string;
  battle: boolean = false;

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.query = this.apollo.watchQuery({
      query: getUserInfo,
      variables: { login: '' },
    });
  }

  executeQuery(name: string, player: number): void {
    this.query.refetch({ login: name }).then((res) => {
      if (player === 1) {
        this.player1Data = res.data;
      } else if (player === 2) {
        this.player2Data = res.data;
      }
      console.log(res); 
    });
    console.log(this.query);
  }

  startBattle(): void {
    if (this.battle) {
      this.battle = false;
      this.player1Data = null;
      this.player2Data = null;
      this.player1Wins = null;
      this.player2Wins = null;
    } else {
      this.battle = true;
      this.setWinner();
    }
  }

  setWinner(): void {
    const player1Result =
      (this.player1Data.user.followers.totalCount -
        this.player1Data.user.following.totalCount) *
      this.player1Data.user.repositories.totalCount;
    const player2Result =
      (this.player2Data.user.followers.totalCount -
        this.player2Data.user.following.totalCount) *
      this.player2Data.user.repositories.totalCount;

    if (player1Result > player2Result) {
      this.player1Wins = 'Winner!';
      this.player2Wins = 'Loser!';
    } else {
      this.player2Wins = 'Winner!';
      this.player1Wins = 'Loser!';
    }
  }
}
