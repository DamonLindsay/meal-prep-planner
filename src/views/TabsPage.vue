<template>
  <IonPage>
    <IonTabs>
      <IonRouterOutlet />
      <IonTabBar slot="bottom">
        <IonTabButton tab="dashboard" href="/tabs/dashboard">
          <IonIcon :icon="barChart" />
          <IonLabel>Dashboard</IonLabel>
        </IonTabButton>
        <IonTabButton tab="meals" href="/tabs/meals">
          <IonIcon :icon="restaurant" />
          <IonLabel>Meals</IonLabel>
        </IonTabButton>
        <IonTabButton tab="planner" href="/tabs/planner">
          <IonIcon :icon="calendar" />
          <IonLabel>Planner</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/tabs/settings">
          <IonIcon :icon="settings" />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonPage>
</template>

<script setup lang="ts">
import {
  IonPage, IonTabs, IonRouterOutlet, IonTabBar,
  IonTabButton, IonIcon, IonLabel
} from '@ionic/vue'
import { barChart, restaurant, calendar, settings } from 'ionicons/icons'
</script>