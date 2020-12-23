import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { PlayersComponent } from './players/players.component';
import { GraphQLModule } from './graphql.module';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
//'bearer 6a74103c6349f5523719b284a9b9048ff25ba7b9'

export function provideApollo(httpLink: HttpLink) {

  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  const auth = setContext((operation, context) => ({
    headers: {
      Authorization: 'bearer 62d7c25feb0a2f32948b08b43783e220a6c5b54f',
    },
  }));

  const uri = 'https://api.github.com/graphql';

  const link = ApolloLink.from([basic, auth, httpLink.create({uri})]);
  const cache = new InMemoryCache();

  return {
    link,
    cache,
  };
}

@NgModule({
  declarations: [AppComponent, HomeComponent, PlayersComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: provideApollo,
      deps: [HttpLink]
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
