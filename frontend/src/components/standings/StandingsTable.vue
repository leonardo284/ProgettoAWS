<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Squadra</th>
        <th>PG</th>
        <th>V</th>
        <th>N</th>
        <th>P</th>
        <th>GF</th>
        <th>GS</th>
        <th>DR</th>
        <th>Pt</th>
      </tr>
    </thead>

    <tbody>
      <StandingsRow
        v-for="(team, index) in standings"
        :key="team.teamId"
        :team="team"
        :position="index + 1"
      />
    </tbody>
  </table>
</template>
