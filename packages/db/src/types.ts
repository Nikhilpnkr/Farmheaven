export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      animal_movements: {
        Row: {
          animal_id: string | null
          at: string
          created_at: string
          created_by: string | null
          farm_id: string
          flock_id: string | null
          from_structure_id: string | null
          id: string
          reason: string | null
          source: Database["public"]["Enums"]["event_source"]
          to_structure_id: string | null
        }
        Insert: {
          animal_id?: string | null
          at?: string
          created_at?: string
          created_by?: string | null
          farm_id: string
          flock_id?: string | null
          from_structure_id?: string | null
          id?: string
          reason?: string | null
          source?: Database["public"]["Enums"]["event_source"]
          to_structure_id?: string | null
        }
        Update: {
          animal_id?: string | null
          at?: string
          created_at?: string
          created_by?: string | null
          farm_id?: string
          flock_id?: string | null
          from_structure_id?: string | null
          id?: string
          reason?: string | null
          source?: Database["public"]["Enums"]["event_source"]
          to_structure_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animal_movements_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_movements_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animals_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_movements_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animals_quarantined"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_movements_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_estrus"
            referencedColumns: ["animal_id"]
          },
          {
            foreignKeyName: "animal_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_movements_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_movements_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_movements_from_structure_id_fkey"
            columns: ["from_structure_id"]
            isOneToOne: false
            referencedRelation: "structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_movements_to_structure_id_fkey"
            columns: ["to_structure_id"]
            isOneToOne: false
            referencedRelation: "structures"
            referencedColumns: ["id"]
          },
        ]
      }
      animals: {
        Row: {
          acquired_at: string | null
          acquisition_cost: number | null
          acquisition_kind: string | null
          acquisition_source: string | null
          breed_id: string | null
          created_at: string
          created_by: string | null
          current_structure_id: string | null
          dam_id: string | null
          date_of_birth: string | null
          days_in_milk: number | null
          external_ids: Json
          farm_id: string
          health_state: Database["public"]["Enums"]["animal_health_state"]
          id: string
          lactation_number: number | null
          last_calving_date: string | null
          last_production_at: string | null
          lifecycle: Database["public"]["Enums"]["animal_lifecycle"] | null
          metadata: Json
          name: string | null
          predicted_next_estrus_at: string | null
          retired_at: string | null
          retirement_reason: string | null
          rfid_tag: string | null
          sex: Database["public"]["Enums"]["sex"]
          sire_id: string | null
          species_code: string
          tag: string
          updated_at: string
        }
        Insert: {
          acquired_at?: string | null
          acquisition_cost?: number | null
          acquisition_kind?: string | null
          acquisition_source?: string | null
          breed_id?: string | null
          created_at?: string
          created_by?: string | null
          current_structure_id?: string | null
          dam_id?: string | null
          date_of_birth?: string | null
          days_in_milk?: number | null
          external_ids?: Json
          farm_id: string
          health_state?: Database["public"]["Enums"]["animal_health_state"]
          id?: string
          lactation_number?: number | null
          last_calving_date?: string | null
          last_production_at?: string | null
          lifecycle?: Database["public"]["Enums"]["animal_lifecycle"] | null
          metadata?: Json
          name?: string | null
          predicted_next_estrus_at?: string | null
          retired_at?: string | null
          retirement_reason?: string | null
          rfid_tag?: string | null
          sex?: Database["public"]["Enums"]["sex"]
          sire_id?: string | null
          species_code: string
          tag: string
          updated_at?: string
        }
        Update: {
          acquired_at?: string | null
          acquisition_cost?: number | null
          acquisition_kind?: string | null
          acquisition_source?: string | null
          breed_id?: string | null
          created_at?: string
          created_by?: string | null
          current_structure_id?: string | null
          dam_id?: string | null
          date_of_birth?: string | null
          days_in_milk?: number | null
          external_ids?: Json
          farm_id?: string
          health_state?: Database["public"]["Enums"]["animal_health_state"]
          id?: string
          lactation_number?: number | null
          last_calving_date?: string | null
          last_production_at?: string | null
          lifecycle?: Database["public"]["Enums"]["animal_lifecycle"] | null
          metadata?: Json
          name?: string | null
          predicted_next_estrus_at?: string | null
          retired_at?: string | null
          retirement_reason?: string | null
          rfid_tag?: string | null
          sex?: Database["public"]["Enums"]["sex"]
          sire_id?: string | null
          species_code?: string
          tag?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "animals_breed_id_fkey"
            columns: ["breed_id"]
            isOneToOne: false
            referencedRelation: "breeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_current_structure_id_fkey"
            columns: ["current_structure_id"]
            isOneToOne: false
            referencedRelation: "structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_dam_id_fkey"
            columns: ["dam_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_dam_id_fkey"
            columns: ["dam_id"]
            isOneToOne: false
            referencedRelation: "v_animals_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_dam_id_fkey"
            columns: ["dam_id"]
            isOneToOne: false
            referencedRelation: "v_animals_quarantined"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_dam_id_fkey"
            columns: ["dam_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_estrus"
            referencedColumns: ["animal_id"]
          },
          {
            foreignKeyName: "animals_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "v_animals_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "v_animals_quarantined"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_estrus"
            referencedColumns: ["animal_id"]
          },
          {
            foreignKeyName: "animals_species_code_fkey"
            columns: ["species_code"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["code"]
          },
        ]
      }
      attendance: {
        Row: {
          check_in_at: string
          check_in_geom: unknown
          check_out_at: string | null
          check_out_geom: unknown
          created_at: string
          farm_id: string
          id: string
          minutes_worked: number | null
          notes: string | null
          source: Database["public"]["Enums"]["event_source"]
          within_geofence: boolean | null
          worker_id: string
        }
        Insert: {
          check_in_at: string
          check_in_geom?: unknown
          check_out_at?: string | null
          check_out_geom?: unknown
          created_at?: string
          farm_id: string
          id?: string
          minutes_worked?: number | null
          notes?: string | null
          source?: Database["public"]["Enums"]["event_source"]
          within_geofence?: boolean | null
          worker_id: string
        }
        Update: {
          check_in_at?: string
          check_in_geom?: unknown
          check_out_at?: string | null
          check_out_geom?: unknown
          created_at?: string
          farm_id?: string
          id?: string
          minutes_worked?: number | null
          notes?: string | null
          source?: Database["public"]["Enums"]["event_source"]
          within_geofence?: boolean | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: Database["public"]["Enums"]["user_role"] | null
          diff: Json | null
          entity_id: string | null
          entity_kind: string
          farm_id: string | null
          id: string
          occurred_at: string
          reason: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["user_role"] | null
          diff?: Json | null
          entity_id?: string | null
          entity_kind: string
          farm_id?: string | null
          id?: string
          occurred_at?: string
          reason?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["user_role"] | null
          diff?: Json | null
          entity_id?: string | null
          entity_kind?: string
          farm_id?: string | null
          id?: string
          occurred_at?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log_default: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: Database["public"]["Enums"]["user_role"] | null
          diff: Json | null
          entity_id: string | null
          entity_kind: string
          farm_id: string | null
          id: string
          occurred_at: string
          reason: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["user_role"] | null
          diff?: Json | null
          entity_id?: string | null
          entity_kind: string
          farm_id?: string | null
          id?: string
          occurred_at?: string
          reason?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: Database["public"]["Enums"]["user_role"] | null
          diff?: Json | null
          entity_id?: string | null
          entity_kind?: string
          farm_id?: string | null
          id?: string
          occurred_at?: string
          reason?: string | null
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          actions: Json
          conditions: Json | null
          cooldown_minutes: number | null
          created_at: string
          created_by: string | null
          description: string | null
          farm_id: string
          fire_count: number | null
          id: string
          is_active: boolean
          last_fired_at: string | null
          metadata: Json
          name: string
          trigger: Json
          updated_at: string
        }
        Insert: {
          actions: Json
          conditions?: Json | null
          cooldown_minutes?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          farm_id: string
          fire_count?: number | null
          id?: string
          is_active?: boolean
          last_fired_at?: string | null
          metadata?: Json
          name: string
          trigger: Json
          updated_at?: string
        }
        Update: {
          actions?: Json
          conditions?: Json | null
          cooldown_minutes?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          farm_id?: string
          fire_count?: number | null
          id?: string
          is_active?: boolean
          last_fired_at?: string | null
          metadata?: Json
          name?: string
          trigger?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_rules_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      breeding_events: {
        Row: {
          animal_id: string
          created_at: string
          event_type: Database["public"]["Enums"]["breeding_event_type"]
          farm_id: string
          id: string
          media: Json
          metadata: Json
          ml_confidence: number | null
          ml_model_version: string | null
          notes: string | null
          observed_by: string | null
          occurred_at: string
          offspring_count: number | null
          predicted_window_end: string | null
          predicted_window_start: string | null
          pregnancy_outcome: string | null
          semen_breed: string | null
          semen_straw_batch: string | null
          sire_id: string | null
          source: Database["public"]["Enums"]["event_source"]
        }
        Insert: {
          animal_id: string
          created_at?: string
          event_type: Database["public"]["Enums"]["breeding_event_type"]
          farm_id: string
          id?: string
          media?: Json
          metadata?: Json
          ml_confidence?: number | null
          ml_model_version?: string | null
          notes?: string | null
          observed_by?: string | null
          occurred_at?: string
          offspring_count?: number | null
          predicted_window_end?: string | null
          predicted_window_start?: string | null
          pregnancy_outcome?: string | null
          semen_breed?: string | null
          semen_straw_batch?: string | null
          sire_id?: string | null
          source?: Database["public"]["Enums"]["event_source"]
        }
        Update: {
          animal_id?: string
          created_at?: string
          event_type?: Database["public"]["Enums"]["breeding_event_type"]
          farm_id?: string
          id?: string
          media?: Json
          metadata?: Json
          ml_confidence?: number | null
          ml_model_version?: string | null
          notes?: string | null
          observed_by?: string | null
          occurred_at?: string
          offspring_count?: number | null
          predicted_window_end?: string | null
          predicted_window_start?: string | null
          pregnancy_outcome?: string | null
          semen_breed?: string | null
          semen_straw_batch?: string | null
          sire_id?: string | null
          source?: Database["public"]["Enums"]["event_source"]
        }
        Relationships: [
          {
            foreignKeyName: "breeding_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animals_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animals_quarantined"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_estrus"
            referencedColumns: ["animal_id"]
          },
          {
            foreignKeyName: "breeding_events_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_events_observed_by_fkey"
            columns: ["observed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_events_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_events_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "v_animals_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_events_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "v_animals_quarantined"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "breeding_events_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_estrus"
            referencedColumns: ["animal_id"]
          },
        ]
      }
      breeds: {
        Row: {
          avg_305d_yield_l: number | null
          avg_egg_per_year: number | null
          code: string
          created_at: string
          id: string
          label: string
          metadata: Json
          origin_region: string | null
          purpose: string[] | null
          species_code: string
          typical_weight_kg_max: number | null
          typical_weight_kg_min: number | null
        }
        Insert: {
          avg_305d_yield_l?: number | null
          avg_egg_per_year?: number | null
          code: string
          created_at?: string
          id?: string
          label: string
          metadata?: Json
          origin_region?: string | null
          purpose?: string[] | null
          species_code: string
          typical_weight_kg_max?: number | null
          typical_weight_kg_min?: number | null
        }
        Update: {
          avg_305d_yield_l?: number | null
          avg_egg_per_year?: number | null
          code?: string
          created_at?: string
          id?: string
          label?: string
          metadata?: Json
          origin_region?: string | null
          purpose?: string[] | null
          species_code?: string
          typical_weight_kg_max?: number | null
          typical_weight_kg_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "breeds_species_code_fkey"
            columns: ["species_code"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["code"]
          },
        ]
      }
      carbon_entries: {
        Row: {
          cost_center_id: string | null
          created_at: string
          direction: string
          evidence_url: string | null
          farm_id: string
          id: string
          metadata: Json
          method: string | null
          period_end: string
          period_start: string
          source_kind: string
          tco2e: number
        }
        Insert: {
          cost_center_id?: string | null
          created_at?: string
          direction: string
          evidence_url?: string | null
          farm_id: string
          id?: string
          metadata?: Json
          method?: string | null
          period_end: string
          period_start: string
          source_kind: string
          tco2e: number
        }
        Update: {
          cost_center_id?: string | null
          created_at?: string
          direction?: string
          evidence_url?: string | null
          farm_id?: string
          id?: string
          metadata?: Json
          method?: string | null
          period_end?: string
          period_start?: string
          source_kind?: string
          tco2e?: number
        }
        Relationships: [
          {
            foreignKeyName: "carbon_entries_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carbon_entries_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      certification_bodies: {
        Row: {
          code: string
          id: string
          label: string
          metadata: Json
          scheme: string
          scope: string | null
          template_url: string | null
        }
        Insert: {
          code: string
          id?: string
          label: string
          metadata?: Json
          scheme: string
          scope?: string | null
          template_url?: string | null
        }
        Update: {
          code?: string
          id?: string
          label?: string
          metadata?: Json
          scheme?: string
          scope?: string | null
          template_url?: string | null
        }
        Relationships: []
      }
      compost_windrows: {
        Row: {
          applied_at: string | null
          applied_to_plot_ids: string[] | null
          c_n_ratio: number | null
          code: string
          core_temp_c: number | null
          created_at: string
          current_stage: string | null
          estimated_output_kg: number | null
          farm_id: string
          id: string
          source_mix: Json
          started_at: string
          updated_at: string
        }
        Insert: {
          applied_at?: string | null
          applied_to_plot_ids?: string[] | null
          c_n_ratio?: number | null
          code: string
          core_temp_c?: number | null
          created_at?: string
          current_stage?: string | null
          estimated_output_kg?: number | null
          farm_id: string
          id?: string
          source_mix?: Json
          started_at: string
          updated_at?: string
        }
        Update: {
          applied_at?: string | null
          applied_to_plot_ids?: string[] | null
          c_n_ratio?: number | null
          code?: string
          core_temp_c?: number | null
          created_at?: string
          current_stage?: string | null
          estimated_output_kg?: number | null
          farm_id?: string
          id?: string
          source_mix?: Json
          started_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compost_windrows_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_centers: {
        Row: {
          code: string
          created_at: string
          farm_id: string
          id: string
          is_active: boolean
          kind: Database["public"]["Enums"]["cost_center_type"]
          label: string
        }
        Insert: {
          code: string
          created_at?: string
          farm_id: string
          id?: string
          is_active?: boolean
          kind: Database["public"]["Enums"]["cost_center_type"]
          label: string
        }
        Update: {
          code?: string
          created_at?: string
          farm_id?: string
          id?: string
          is_active?: boolean
          kind?: Database["public"]["Enums"]["cost_center_type"]
          label?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_centers_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_cycles: {
        Row: {
          actual_yield_kg: number | null
          area_acres: number | null
          closed_at: string | null
          created_at: string
          crop_id: string
          current_stage: Database["public"]["Enums"]["plot_stage"]
          expected_harvest_end: string | null
          expected_harvest_start: string | null
          farm_id: string
          forecast_confidence: number | null
          forecast_updated_at: string | null
          forecast_window_days: number | null
          forecast_yield_kg: number | null
          id: string
          metadata: Json
          notes: string | null
          plot_id: string
          season: string | null
          sowing_date: string | null
          stage_changed_at: string | null
          target_yield_kg: number | null
          updated_at: string
          variety: string | null
        }
        Insert: {
          actual_yield_kg?: number | null
          area_acres?: number | null
          closed_at?: string | null
          created_at?: string
          crop_id: string
          current_stage?: Database["public"]["Enums"]["plot_stage"]
          expected_harvest_end?: string | null
          expected_harvest_start?: string | null
          farm_id: string
          forecast_confidence?: number | null
          forecast_updated_at?: string | null
          forecast_window_days?: number | null
          forecast_yield_kg?: number | null
          id?: string
          metadata?: Json
          notes?: string | null
          plot_id: string
          season?: string | null
          sowing_date?: string | null
          stage_changed_at?: string | null
          target_yield_kg?: number | null
          updated_at?: string
          variety?: string | null
        }
        Update: {
          actual_yield_kg?: number | null
          area_acres?: number | null
          closed_at?: string | null
          created_at?: string
          crop_id?: string
          current_stage?: Database["public"]["Enums"]["plot_stage"]
          expected_harvest_end?: string | null
          expected_harvest_start?: string | null
          farm_id?: string
          forecast_confidence?: number | null
          forecast_updated_at?: string | null
          forecast_window_days?: number | null
          forecast_yield_kg?: number | null
          id?: string
          metadata?: Json
          notes?: string | null
          plot_id?: string
          season?: string | null
          sowing_date?: string | null
          stage_changed_at?: string | null
          target_yield_kg?: number | null
          updated_at?: string
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_cycles_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_cycles_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crop_cycles_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      crops: {
        Row: {
          code: string
          companion_codes: string[] | null
          created_at: string
          cycle_days_max: number | null
          cycle_days_min: number | null
          family: string | null
          hindi_label: string | null
          id: string
          kind: string | null
          label: string
          metadata: Json
          rotation_partner_codes: string[] | null
          telugu_label: string | null
          water_need_mm: number | null
        }
        Insert: {
          code: string
          companion_codes?: string[] | null
          created_at?: string
          cycle_days_max?: number | null
          cycle_days_min?: number | null
          family?: string | null
          hindi_label?: string | null
          id?: string
          kind?: string | null
          label: string
          metadata?: Json
          rotation_partner_codes?: string[] | null
          telugu_label?: string | null
          water_need_mm?: number | null
        }
        Update: {
          code?: string
          companion_codes?: string[] | null
          created_at?: string
          cycle_days_max?: number | null
          cycle_days_min?: number | null
          family?: string | null
          hindi_label?: string | null
          id?: string
          kind?: string | null
          label?: string
          metadata?: Json
          rotation_partner_codes?: string[] | null
          telugu_label?: string | null
          water_need_mm?: number | null
        }
        Relationships: []
      }
      customer_addresses: {
        Row: {
          city: string | null
          created_at: string
          customer_id: string
          delivery_notes: string | null
          full_address: string
          geom: unknown
          id: string
          is_default: boolean | null
          label: string | null
          pincode: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          customer_id: string
          delivery_notes?: string | null
          full_address: string
          geom?: unknown
          id?: string
          is_default?: boolean | null
          label?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          created_at?: string
          customer_id?: string
          delivery_notes?: string | null
          full_address?: string
          geom?: unknown
          id?: string
          is_default?: boolean | null
          label?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_events: {
        Row: {
          body: string | null
          created_at: string
          customer_id: string
          farm_id: string
          id: string
          kind: string
          occurred_at: string
          payload: Json | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          customer_id: string
          farm_id: string
          id?: string
          kind: string
          occurred_at?: string
          payload?: Json | null
        }
        Update: {
          body?: string | null
          created_at?: string
          customer_id?: string
          farm_id?: string
          id?: string
          kind?: string
          occurred_at?: string
          payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_events_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string | null
          farm_id: string
          first_order_at: string | null
          full_name: string
          id: string
          is_active: boolean
          last_order_at: string | null
          ltv: number | null
          marketing_consent: boolean | null
          metadata: Json
          nps_captured_at: string | null
          nps_score: number | null
          orders_count: number | null
          phone: string | null
          preferred_lang: string | null
          profile_id: string | null
          segment_membership: Json | null
          source: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          farm_id: string
          first_order_at?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          last_order_at?: string | null
          ltv?: number | null
          marketing_consent?: boolean | null
          metadata?: Json
          nps_captured_at?: string | null
          nps_score?: number | null
          orders_count?: number | null
          phone?: string | null
          preferred_lang?: string | null
          profile_id?: string | null
          segment_membership?: Json | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          farm_id?: string
          first_order_at?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          last_order_at?: string | null
          ltv?: number | null
          marketing_consent?: boolean | null
          metadata?: Json
          nps_captured_at?: string | null
          nps_score?: number | null
          orders_count?: number | null
          phone?: string | null
          preferred_lang?: string | null
          profile_id?: string | null
          segment_membership?: Json | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_routes: {
        Row: {
          assigned_worker_id: string | null
          cost: number | null
          created_at: string
          distance_km: number | null
          farm_id: string
          id: string
          label: string | null
          polyline: string | null
          route_date: string
          status: string | null
          stops: Json | null
          updated_at: string
        }
        Insert: {
          assigned_worker_id?: string | null
          cost?: number | null
          created_at?: string
          distance_km?: number | null
          farm_id: string
          id?: string
          label?: string | null
          polyline?: string | null
          route_date: string
          status?: string | null
          stops?: Json | null
          updated_at?: string
        }
        Update: {
          assigned_worker_id?: string | null
          cost?: number | null
          created_at?: string
          distance_km?: number | null
          farm_id?: string
          id?: string
          label?: string | null
          polyline?: string | null
          route_date?: string
          status?: string | null
          stops?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_routes_assigned_worker_id_fkey"
            columns: ["assigned_worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_routes_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      device_commands: {
        Row: {
          acked_at: string | null
          command: string
          created_at: string
          device_id: string
          error: string | null
          farm_id: string
          id: string
          payload: Json | null
          queued_at: string
          sent_at: string | null
          source_rule_id: string | null
          source_user_id: string | null
          status: string
        }
        Insert: {
          acked_at?: string | null
          command: string
          created_at?: string
          device_id: string
          error?: string | null
          farm_id: string
          id?: string
          payload?: Json | null
          queued_at?: string
          sent_at?: string | null
          source_rule_id?: string | null
          source_user_id?: string | null
          status?: string
        }
        Update: {
          acked_at?: string | null
          command?: string
          created_at?: string
          device_id?: string
          error?: string | null
          farm_id?: string
          id?: string
          payload?: Json | null
          queued_at?: string
          sent_at?: string | null
          source_rule_id?: string | null
          source_user_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_commands_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_commands_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_commands_source_rule_id_fkey"
            columns: ["source_rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_commands_source_user_id_fkey"
            columns: ["source_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          battery_pct: number | null
          code: string
          created_at: string
          farm_id: string
          firmware_version: string | null
          geom: unknown
          hw_serial: string | null
          id: string
          installed_at: string | null
          kind: string
          label: string
          last_seen_at: string | null
          metadata: Json
          model: string | null
          mqtt_topic: string | null
          plot_id: string | null
          retired_at: string | null
          signal_rssi: number | null
          status: Database["public"]["Enums"]["device_status"]
          structure_id: string | null
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          battery_pct?: number | null
          code: string
          created_at?: string
          farm_id: string
          firmware_version?: string | null
          geom?: unknown
          hw_serial?: string | null
          id?: string
          installed_at?: string | null
          kind: string
          label: string
          last_seen_at?: string | null
          metadata?: Json
          model?: string | null
          mqtt_topic?: string | null
          plot_id?: string | null
          retired_at?: string | null
          signal_rssi?: number | null
          status?: Database["public"]["Enums"]["device_status"]
          structure_id?: string | null
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          battery_pct?: number | null
          code?: string
          created_at?: string
          farm_id?: string
          firmware_version?: string | null
          geom?: unknown
          hw_serial?: string | null
          id?: string
          installed_at?: string | null
          kind?: string
          label?: string
          last_seen_at?: string | null
          metadata?: Json
          model?: string | null
          mqtt_topic?: string | null
          plot_id?: string | null
          retired_at?: string | null
          signal_rssi?: number | null
          status?: Database["public"]["Enums"]["device_status"]
          structure_id?: string | null
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_structure_id_fkey"
            columns: ["structure_id"]
            isOneToOne: false
            referencedRelation: "structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_certifications: {
        Row: {
          body_id: string
          cert_number: string
          created_at: string
          document_url: string | null
          farm_id: string
          id: string
          issued_on: string | null
          metadata: Json
          next_audit_at: string | null
          scope_notes: string | null
          status: Database["public"]["Enums"]["cert_status"]
          updated_at: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          body_id: string
          cert_number: string
          created_at?: string
          document_url?: string | null
          farm_id: string
          id?: string
          issued_on?: string | null
          metadata?: Json
          next_audit_at?: string | null
          scope_notes?: string | null
          status?: Database["public"]["Enums"]["cert_status"]
          updated_at?: string
          valid_from: string
          valid_until: string
        }
        Update: {
          body_id?: string
          cert_number?: string
          created_at?: string
          document_url?: string | null
          farm_id?: string
          id?: string
          issued_on?: string | null
          metadata?: Json
          next_audit_at?: string | null
          scope_notes?: string | null
          status?: Database["public"]["Enums"]["cert_status"]
          updated_at?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_certifications_body_id_fkey"
            columns: ["body_id"]
            isOneToOne: false
            referencedRelation: "certification_bodies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farm_certifications_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          address_line: string | null
          boundary_geom: unknown
          certifications: Json
          country: string | null
          created_at: string
          default_langs: string[]
          deleted_at: string | null
          fiscal_year_start_month: number | null
          id: string
          location_geom: unknown
          metadata: Json
          name: string
          org_id: string
          pincode: string | null
          primary_currency: string
          slug: string
          state: string | null
          timezone: string | null
          total_acres: number | null
          updated_at: string
        }
        Insert: {
          address_line?: string | null
          boundary_geom?: unknown
          certifications?: Json
          country?: string | null
          created_at?: string
          default_langs?: string[]
          deleted_at?: string | null
          fiscal_year_start_month?: number | null
          id?: string
          location_geom?: unknown
          metadata?: Json
          name: string
          org_id: string
          pincode?: string | null
          primary_currency?: string
          slug: string
          state?: string | null
          timezone?: string | null
          total_acres?: number | null
          updated_at?: string
        }
        Update: {
          address_line?: string | null
          boundary_geom?: unknown
          certifications?: Json
          country?: string | null
          created_at?: string
          default_langs?: string[]
          deleted_at?: string | null
          fiscal_year_start_month?: number | null
          id?: string
          location_geom?: unknown
          metadata?: Json
          name?: string
          org_id?: string
          pincode?: string | null
          primary_currency?: string
          slug?: string
          state?: string | null
          timezone?: string | null
          total_acres?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farms_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      flock_fcr_rollups: {
        Row: {
          body_weight_kg: number | null
          fcr: number | null
          feed_consumed_kg: number | null
          flock_id: string
          generated_at: string
          id: string
          mortality_pct: number | null
          period_end: string | null
          period_start: string | null
        }
        Insert: {
          body_weight_kg?: number | null
          fcr?: number | null
          feed_consumed_kg?: number | null
          flock_id: string
          generated_at?: string
          id?: string
          mortality_pct?: number | null
          period_end?: string | null
          period_start?: string | null
        }
        Update: {
          body_weight_kg?: number | null
          fcr?: number | null
          feed_consumed_kg?: number | null
          flock_id?: string
          generated_at?: string
          id?: string
          mortality_pct?: number | null
          period_end?: string | null
          period_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flock_fcr_rollups_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flocks"
            referencedColumns: ["id"]
          },
        ]
      }
      flocks: {
        Row: {
          breed_id: string | null
          closed_at: string | null
          code: string
          created_at: string
          culled: number
          date_placed: string
          expected_exit_date: string | null
          farm_id: string
          headcount_current: number
          headcount_initial: number
          id: string
          metadata: Json
          mortalities: number
          name: string | null
          purpose: Database["public"]["Enums"]["flock_purpose"]
          sold: number
          species_code: string
          structure_id: string | null
          target_fcr: number | null
          updated_at: string
        }
        Insert: {
          breed_id?: string | null
          closed_at?: string | null
          code: string
          created_at?: string
          culled?: number
          date_placed: string
          expected_exit_date?: string | null
          farm_id: string
          headcount_current: number
          headcount_initial: number
          id?: string
          metadata?: Json
          mortalities?: number
          name?: string | null
          purpose: Database["public"]["Enums"]["flock_purpose"]
          sold?: number
          species_code: string
          structure_id?: string | null
          target_fcr?: number | null
          updated_at?: string
        }
        Update: {
          breed_id?: string | null
          closed_at?: string | null
          code?: string
          created_at?: string
          culled?: number
          date_placed?: string
          expected_exit_date?: string | null
          farm_id?: string
          headcount_current?: number
          headcount_initial?: number
          id?: string
          metadata?: Json
          mortalities?: number
          name?: string | null
          purpose?: Database["public"]["Enums"]["flock_purpose"]
          sold?: number
          species_code?: string
          structure_id?: string | null
          target_fcr?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flocks_breed_id_fkey"
            columns: ["breed_id"]
            isOneToOne: false
            referencedRelation: "breeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flocks_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flocks_species_code_fkey"
            columns: ["species_code"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "flocks_structure_id_fkey"
            columns: ["structure_id"]
            isOneToOne: false
            referencedRelation: "structures"
            referencedColumns: ["id"]
          },
        ]
      }
      health_events: {
        Row: {
          animal_id: string | null
          batch_number: string | null
          body_condition_score: number | null
          created_at: string
          diagnosis: string | null
          dose_unit: string | null
          dose_value: number | null
          drug_cdsco_code: string | null
          drug_name: string | null
          duration_days: number | null
          event_type: Database["public"]["Enums"]["health_event_type"]
          farm_id: string
          flock_id: string | null
          frequency: string | null
          id: string
          idempotency_key: string | null
          inventory_lot_id: string | null
          meat_withdrawal_days: number | null
          media: Json
          metadata: Json
          milk_withdrawal_hours: number | null
          notes: string | null
          observed_by: string | null
          occurred_at: string
          prescribed_by: string | null
          prescription_signed_at: string | null
          route: string | null
          source: Database["public"]["Enums"]["event_source"]
          symptoms: string[] | null
          temperature_c: number | null
          voice_note_url: string | null
          voice_transcript: string | null
          withdrawal_until_meat: string | null
          withdrawal_until_milk: string | null
        }
        Insert: {
          animal_id?: string | null
          batch_number?: string | null
          body_condition_score?: number | null
          created_at?: string
          diagnosis?: string | null
          dose_unit?: string | null
          dose_value?: number | null
          drug_cdsco_code?: string | null
          drug_name?: string | null
          duration_days?: number | null
          event_type: Database["public"]["Enums"]["health_event_type"]
          farm_id: string
          flock_id?: string | null
          frequency?: string | null
          id?: string
          idempotency_key?: string | null
          inventory_lot_id?: string | null
          meat_withdrawal_days?: number | null
          media?: Json
          metadata?: Json
          milk_withdrawal_hours?: number | null
          notes?: string | null
          observed_by?: string | null
          occurred_at?: string
          prescribed_by?: string | null
          prescription_signed_at?: string | null
          route?: string | null
          source?: Database["public"]["Enums"]["event_source"]
          symptoms?: string[] | null
          temperature_c?: number | null
          voice_note_url?: string | null
          voice_transcript?: string | null
          withdrawal_until_meat?: string | null
          withdrawal_until_milk?: string | null
        }
        Update: {
          animal_id?: string | null
          batch_number?: string | null
          body_condition_score?: number | null
          created_at?: string
          diagnosis?: string | null
          dose_unit?: string | null
          dose_value?: number | null
          drug_cdsco_code?: string | null
          drug_name?: string | null
          duration_days?: number | null
          event_type?: Database["public"]["Enums"]["health_event_type"]
          farm_id?: string
          flock_id?: string | null
          frequency?: string | null
          id?: string
          idempotency_key?: string | null
          inventory_lot_id?: string | null
          meat_withdrawal_days?: number | null
          media?: Json
          metadata?: Json
          milk_withdrawal_hours?: number | null
          notes?: string | null
          observed_by?: string | null
          occurred_at?: string
          prescribed_by?: string | null
          prescription_signed_at?: string | null
          route?: string | null
          source?: Database["public"]["Enums"]["event_source"]
          symptoms?: string[] | null
          temperature_c?: number | null
          voice_note_url?: string | null
          voice_transcript?: string | null
          withdrawal_until_meat?: string | null
          withdrawal_until_milk?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animals_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animals_quarantined"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_estrus"
            referencedColumns: ["animal_id"]
          },
          {
            foreignKeyName: "health_events_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_events_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_events_inventory_lot_fk"
            columns: ["inventory_lot_id"]
            isOneToOne: false
            referencedRelation: "inventory_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_events_observed_by_fkey"
            columns: ["observed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_events_prescribed_by_fkey"
            columns: ["prescribed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_lots: {
        Row: {
          created_at: string
          expires_at: string | null
          farm_id: string
          id: string
          internal_batch: string
          is_harvested_on_farm: boolean
          location: string | null
          metadata: Json
          notes: string | null
          parent_lot_ids: string[] | null
          quantity_initial: number
          quantity_remaining: number
          received_at: string
          sku_id: string
          supplier_batch_ref: string | null
          supplier_cert_number_snapshot: string | null
          supplier_cert_status_at_purchase:
            | Database["public"]["Enums"]["cert_status"]
            | null
          supplier_id: string | null
          unit: string
          unit_cost: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          farm_id: string
          id?: string
          internal_batch: string
          is_harvested_on_farm?: boolean
          location?: string | null
          metadata?: Json
          notes?: string | null
          parent_lot_ids?: string[] | null
          quantity_initial: number
          quantity_remaining: number
          received_at?: string
          sku_id: string
          supplier_batch_ref?: string | null
          supplier_cert_number_snapshot?: string | null
          supplier_cert_status_at_purchase?:
            | Database["public"]["Enums"]["cert_status"]
            | null
          supplier_id?: string | null
          unit: string
          unit_cost?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          farm_id?: string
          id?: string
          internal_batch?: string
          is_harvested_on_farm?: boolean
          location?: string | null
          metadata?: Json
          notes?: string | null
          parent_lot_ids?: string[] | null
          quantity_initial?: number
          quantity_remaining?: number
          received_at?: string
          sku_id?: string
          supplier_batch_ref?: string | null
          supplier_cert_number_snapshot?: string | null
          supplier_cert_status_at_purchase?:
            | Database["public"]["Enums"]["cert_status"]
            | null
          supplier_id?: string | null
          unit?: string
          unit_cost?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_lots_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_lots_sku_id_fkey"
            columns: ["sku_id"]
            isOneToOne: false
            referencedRelation: "skus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_lots_sku_id_fkey"
            columns: ["sku_id"]
            isOneToOne: false
            referencedRelation: "v_inventory_onhand"
            referencedColumns: ["sku_id"]
          },
          {
            foreignKeyName: "inventory_lots_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          animal_id: string | null
          created_at: string
          farm_id: string
          flock_id: string | null
          id: string
          lot_id: string
          metadata: Json
          movement_type: string
          notes: string | null
          occurred_at: string
          plot_id: string | null
          quantity: number
          recorded_by: string | null
          reference_id: string | null
          reference_kind: string | null
          structure_id: string | null
          unit: string
        }
        Insert: {
          animal_id?: string | null
          created_at?: string
          farm_id: string
          flock_id?: string | null
          id?: string
          lot_id: string
          metadata?: Json
          movement_type: string
          notes?: string | null
          occurred_at?: string
          plot_id?: string | null
          quantity: number
          recorded_by?: string | null
          reference_id?: string | null
          reference_kind?: string | null
          structure_id?: string | null
          unit: string
        }
        Update: {
          animal_id?: string | null
          created_at?: string
          farm_id?: string
          flock_id?: string | null
          id?: string
          lot_id?: string
          metadata?: Json
          movement_type?: string
          notes?: string | null
          occurred_at?: string
          plot_id?: string | null
          quantity?: number
          recorded_by?: string | null
          reference_id?: string | null
          reference_kind?: string | null
          structure_id?: string | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animals_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animals_quarantined"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_estrus"
            referencedColumns: ["animal_id"]
          },
          {
            foreignKeyName: "inventory_movements_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "inventory_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_structure_id_fkey"
            columns: ["structure_id"]
            isOneToOne: false
            referencedRelation: "structures"
            referencedColumns: ["id"]
          },
        ]
      }
      ipm_logs: {
        Row: {
          action_taken: string | null
          created_at: string
          crop_cycle_id: string | null
          farm_id: string
          id: string
          input_lot_id: string | null
          media: Json
          method: string | null
          notes: string | null
          observed_at: string
          observed_by: string | null
          pest: string | null
          plot_id: string
          pressure: string | null
        }
        Insert: {
          action_taken?: string | null
          created_at?: string
          crop_cycle_id?: string | null
          farm_id: string
          id?: string
          input_lot_id?: string | null
          media?: Json
          method?: string | null
          notes?: string | null
          observed_at?: string
          observed_by?: string | null
          pest?: string | null
          plot_id: string
          pressure?: string | null
        }
        Update: {
          action_taken?: string | null
          created_at?: string
          crop_cycle_id?: string | null
          farm_id?: string
          id?: string
          input_lot_id?: string | null
          media?: Json
          method?: string | null
          notes?: string | null
          observed_at?: string
          observed_by?: string | null
          pest?: string | null
          plot_id?: string
          pressure?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ipm_logs_crop_cycle_id_fkey"
            columns: ["crop_cycle_id"]
            isOneToOne: false
            referencedRelation: "crop_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipm_logs_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipm_logs_input_lot_fk"
            columns: ["input_lot_id"]
            isOneToOne: false
            referencedRelation: "inventory_lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipm_logs_observed_by_fkey"
            columns: ["observed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipm_logs_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      lactation_rollups: {
        Row: {
          animal_id: string
          days_in_milk: number | null
          end_date: string | null
          farm_id: string
          generated_at: string
          id: string
          lactation_number: number | null
          peak_l_per_day: number | null
          persistence_index: number | null
          projected_305d_l: number | null
          start_date: string | null
          total_milk_l: number | null
        }
        Insert: {
          animal_id: string
          days_in_milk?: number | null
          end_date?: string | null
          farm_id: string
          generated_at?: string
          id?: string
          lactation_number?: number | null
          peak_l_per_day?: number | null
          persistence_index?: number | null
          projected_305d_l?: number | null
          start_date?: string | null
          total_milk_l?: number | null
        }
        Update: {
          animal_id?: string
          days_in_milk?: number | null
          end_date?: string | null
          farm_id?: string
          generated_at?: string
          id?: string
          lactation_number?: number | null
          peak_l_per_day?: number | null
          persistence_index?: number | null
          projected_305d_l?: number | null
          start_date?: string | null
          total_milk_l?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lactation_rollups_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lactation_rollups_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animals_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lactation_rollups_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animals_quarantined"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lactation_rollups_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_estrus"
            referencedColumns: ["animal_id"]
          },
          {
            foreignKeyName: "lactation_rollups_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          accepted_at: string | null
          created_at: string
          farm_id: string
          id: string
          invited_at: string | null
          invited_by: string | null
          is_active: boolean
          role: Database["public"]["Enums"]["user_role"]
          scoped_animal_ids: string[] | null
          scoped_module: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          farm_id: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean
          role: Database["public"]["Enums"]["user_role"]
          scoped_animal_ids?: string[] | null
          scoped_module?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          farm_id?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          scoped_animal_ids?: string[] | null
          scoped_module?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          gst_rate_pct: number | null
          id: string
          line_total: number
          name_snapshot: string
          order_id: string
          picked_lot_ids: string[] | null
          product_id: string
          quantity: number
          sku_id: string | null
          unit: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          gst_rate_pct?: number | null
          id?: string
          line_total: number
          name_snapshot: string
          order_id: string
          picked_lot_ids?: string[] | null
          product_id: string
          quantity: number
          sku_id?: string | null
          unit: string
          unit_price: number
        }
        Update: {
          created_at?: string
          gst_rate_pct?: number | null
          id?: string
          line_total?: number
          name_snapshot?: string
          order_id?: string
          picked_lot_ids?: string[] | null
          product_id?: string
          quantity?: number
          sku_id?: string | null
          unit?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_sku_id_fkey"
            columns: ["sku_id"]
            isOneToOne: false
            referencedRelation: "skus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_sku_id_fkey"
            columns: ["sku_id"]
            isOneToOne: false
            referencedRelation: "v_inventory_onhand"
            referencedColumns: ["sku_id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string | null
          assigned_delivery_id: string | null
          assigned_packer_id: string | null
          cancel_reason: string | null
          cancelled_at: string | null
          created_at: string
          customer_id: string
          delivered_at: string | null
          delivery_date: string | null
          delivery_fee: number | null
          delivery_slot: string | null
          discount: number | null
          dispatched_at: string | null
          farm_id: string
          gst: number | null
          id: string
          metadata: Json
          notes: string | null
          order_number: string
          packed_at: string | null
          payment_method: string | null
          payment_ref: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          placed_at: string
          route_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          sub_total: number
          subscription_id: string | null
          total: number
          updated_at: string
        }
        Insert: {
          address_id?: string | null
          assigned_delivery_id?: string | null
          assigned_packer_id?: string | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          customer_id: string
          delivered_at?: string | null
          delivery_date?: string | null
          delivery_fee?: number | null
          delivery_slot?: string | null
          discount?: number | null
          dispatched_at?: string | null
          farm_id: string
          gst?: number | null
          id?: string
          metadata?: Json
          notes?: string | null
          order_number: string
          packed_at?: string | null
          payment_method?: string | null
          payment_ref?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          placed_at?: string
          route_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          sub_total: number
          subscription_id?: string | null
          total: number
          updated_at?: string
        }
        Update: {
          address_id?: string | null
          assigned_delivery_id?: string | null
          assigned_packer_id?: string | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          customer_id?: string
          delivered_at?: string | null
          delivery_date?: string | null
          delivery_fee?: number | null
          delivery_slot?: string | null
          discount?: number | null
          dispatched_at?: string | null
          farm_id?: string
          gst?: number | null
          id?: string
          metadata?: Json
          notes?: string | null
          order_number?: string
          packed_at?: string | null
          payment_method?: string | null
          payment_ref?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          placed_at?: string
          route_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          sub_total?: number
          subscription_id?: string | null
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "customer_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_assigned_delivery_id_fkey"
            columns: ["assigned_delivery_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_assigned_packer_id_fkey"
            columns: ["assigned_packer_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_route_fk"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "delivery_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      orgs: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          name: string
          owner_id: string
          plan: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json
          name: string
          owner_id: string
          plan?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          name?: string
          owner_id?: string
          plan?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orgs_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_runs: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          farm_id: string
          id: string
          notes: string | null
          paid_at: string | null
          period_month: string
          status: string
          total_esic: number
          total_gross: number
          total_net: number
          total_pf: number
          total_tds: number
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          farm_id: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          period_month: string
          status?: string
          total_esic?: number
          total_gross?: number
          total_net?: number
          total_pf?: number
          total_tds?: number
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          farm_id?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          period_month?: string
          status?: string
          total_esic?: number
          total_gross?: number
          total_net?: number
          total_pf?: number
          total_tds?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_runs_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_runs_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      payslips: {
        Row: {
          advance_deduction: number | null
          created_at: string
          days_worked: number
          esic_employee: number | null
          esic_employer: number | null
          farm_id: string
          gross: number
          id: string
          net: number
          payroll_run_id: string
          payslip_lang: string | null
          payslip_pdf_url: string | null
          pf_employee: number | null
          pf_employer: number | null
          piece_rate_amount: number
          tds: number | null
          transaction_id: string | null
          wage_amount: number
          whatsapp_sent_at: string | null
          worker_id: string
        }
        Insert: {
          advance_deduction?: number | null
          created_at?: string
          days_worked?: number
          esic_employee?: number | null
          esic_employer?: number | null
          farm_id: string
          gross?: number
          id?: string
          net?: number
          payroll_run_id: string
          payslip_lang?: string | null
          payslip_pdf_url?: string | null
          pf_employee?: number | null
          pf_employer?: number | null
          piece_rate_amount?: number
          tds?: number | null
          transaction_id?: string | null
          wage_amount?: number
          whatsapp_sent_at?: string | null
          worker_id: string
        }
        Update: {
          advance_deduction?: number | null
          created_at?: string
          days_worked?: number
          esic_employee?: number | null
          esic_employer?: number | null
          farm_id?: string
          gross?: number
          id?: string
          net?: number
          payroll_run_id?: string
          payslip_lang?: string | null
          payslip_pdf_url?: string | null
          pf_employee?: number | null
          pf_employer?: number | null
          piece_rate_amount?: number
          tds?: number | null
          transaction_id?: string | null
          wage_amount?: number
          whatsapp_sent_at?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payslips_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payslips_payroll_run_id_fkey"
            columns: ["payroll_run_id"]
            isOneToOne: false
            referencedRelation: "payroll_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payslips_transaction_fk"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payslips_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      piece_work_logs: {
        Row: {
          amount: number | null
          created_at: string
          farm_id: string
          id: string
          occurred_at: string
          quantity: number
          rate_per_unit: number
          reference_id: string | null
          reference_kind: string | null
          unit: string
          work_kind: string
          worker_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          farm_id: string
          id?: string
          occurred_at?: string
          quantity: number
          rate_per_unit: number
          reference_id?: string | null
          reference_kind?: string | null
          unit: string
          work_kind: string
          worker_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          farm_id?: string
          id?: string
          occurred_at?: string
          quantity?: number
          rate_per_unit?: number
          reference_id?: string | null
          reference_kind?: string | null
          unit?: string
          work_kind?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "piece_work_logs_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "piece_work_logs_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      plots: {
        Row: {
          area_acres: number
          boundary_geom: unknown
          center_geom: unknown
          certification_since: string | null
          code: string
          created_at: string
          deleted_at: string | null
          farm_id: string
          id: string
          is_certified_organic: boolean
          metadata: Json
          name: string
          slope_pct: number | null
          soil_type: string | null
          updated_at: string
          water_source: string | null
        }
        Insert: {
          area_acres: number
          boundary_geom?: unknown
          center_geom?: unknown
          certification_since?: string | null
          code: string
          created_at?: string
          deleted_at?: string | null
          farm_id: string
          id?: string
          is_certified_organic?: boolean
          metadata?: Json
          name: string
          slope_pct?: number | null
          soil_type?: string | null
          updated_at?: string
          water_source?: string | null
        }
        Update: {
          area_acres?: number
          boundary_geom?: unknown
          center_geom?: unknown
          certification_since?: string | null
          code?: string
          created_at?: string
          deleted_at?: string | null
          farm_id?: string
          id?: string
          is_certified_organic?: boolean
          metadata?: Json
          name?: string
          slope_pct?: number | null
          soil_type?: string | null
          updated_at?: string
          water_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plots_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      production_events: {
        Row: {
          animal_id: string | null
          created_at: string
          crop_cycle_id: string | null
          disposition: string | null
          farm_id: string
          flock_id: string | null
          id: string
          idempotency_key: string | null
          is_quarantined: boolean
          kind: Database["public"]["Enums"]["production_type"]
          media: Json
          metadata: Json
          notes: string | null
          occurred_at: string
          plot_id: string | null
          quality: Json
          quantity: number
          quarantine_reason:
            | Database["public"]["Enums"]["quarantine_reason"]
            | null
          quarantined_until: string | null
          recorded_by: string | null
          shift: string | null
          source: Database["public"]["Enums"]["event_source"]
          structure_id: string | null
          unit: string
        }
        Insert: {
          animal_id?: string | null
          created_at?: string
          crop_cycle_id?: string | null
          disposition?: string | null
          farm_id: string
          flock_id?: string | null
          id?: string
          idempotency_key?: string | null
          is_quarantined?: boolean
          kind: Database["public"]["Enums"]["production_type"]
          media?: Json
          metadata?: Json
          notes?: string | null
          occurred_at?: string
          plot_id?: string | null
          quality?: Json
          quantity: number
          quarantine_reason?:
            | Database["public"]["Enums"]["quarantine_reason"]
            | null
          quarantined_until?: string | null
          recorded_by?: string | null
          shift?: string | null
          source?: Database["public"]["Enums"]["event_source"]
          structure_id?: string | null
          unit: string
        }
        Update: {
          animal_id?: string | null
          created_at?: string
          crop_cycle_id?: string | null
          disposition?: string | null
          farm_id?: string
          flock_id?: string | null
          id?: string
          idempotency_key?: string | null
          is_quarantined?: boolean
          kind?: Database["public"]["Enums"]["production_type"]
          media?: Json
          metadata?: Json
          notes?: string | null
          occurred_at?: string
          plot_id?: string | null
          quality?: Json
          quantity?: number
          quarantine_reason?:
            | Database["public"]["Enums"]["quarantine_reason"]
            | null
          quarantined_until?: string | null
          recorded_by?: string | null
          shift?: string | null
          source?: Database["public"]["Enums"]["event_source"]
          structure_id?: string | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animals_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animals_quarantined"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_estrus"
            referencedColumns: ["animal_id"]
          },
          {
            foreignKeyName: "production_events_crop_cycle_fk"
            columns: ["crop_cycle_id"]
            isOneToOne: false
            referencedRelation: "crop_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_events_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_events_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_events_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_events_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_events_structure_id_fkey"
            columns: ["structure_id"]
            isOneToOne: false
            referencedRelation: "structures"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badges: string[] | null
          category: string | null
          created_at: string
          description: string | null
          farm_id: string
          gst_rate_pct: number | null
          id: string
          image_urls: string[] | null
          inventory_policy: string | null
          is_available: boolean | null
          is_subscribable: boolean | null
          lead_time_hours: number | null
          meta_seo: Json | null
          metadata: Json
          mrp: number | null
          name: string
          price: number
          sku_id: string | null
          slug: string
          tagline: string | null
          unit_label: string | null
          updated_at: string
        }
        Insert: {
          badges?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          farm_id: string
          gst_rate_pct?: number | null
          id?: string
          image_urls?: string[] | null
          inventory_policy?: string | null
          is_available?: boolean | null
          is_subscribable?: boolean | null
          lead_time_hours?: number | null
          meta_seo?: Json | null
          metadata?: Json
          mrp?: number | null
          name: string
          price: number
          sku_id?: string | null
          slug: string
          tagline?: string | null
          unit_label?: string | null
          updated_at?: string
        }
        Update: {
          badges?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          farm_id?: string
          gst_rate_pct?: number | null
          id?: string
          image_urls?: string[] | null
          inventory_policy?: string | null
          is_available?: boolean | null
          is_subscribable?: boolean | null
          lead_time_hours?: number | null
          meta_seo?: Json | null
          metadata?: Json
          mrp?: number | null
          name?: string
          price?: number
          sku_id?: string | null
          slug?: string
          tagline?: string | null
          unit_label?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_sku_id_fkey"
            columns: ["sku_id"]
            isOneToOne: false
            referencedRelation: "skus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_sku_id_fkey"
            columns: ["sku_id"]
            isOneToOne: false
            referencedRelation: "v_inventory_onhand"
            referencedColumns: ["sku_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          metadata: Json
          phone: string | null
          preferred_lang: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          metadata?: Json
          phone?: string | null
          preferred_lang?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          metadata?: Json
          phone?: string | null
          preferred_lang?: string
          updated_at?: string
        }
        Relationships: []
      }
      remote_sensing_runs: {
        Row: {
          avg_ndvi: number | null
          cost: number | null
          created_at: string
          farm_id: string
          flight_date: string
          id: string
          kind: string
          metadata: Json
          ndvi_url: string | null
          notes: string | null
          orthomosaic_url: string | null
          plot_id: string | null
          stress_area_acres: number | null
          stress_zones_geom: unknown
          thermal_url: string | null
          vendor: string | null
        }
        Insert: {
          avg_ndvi?: number | null
          cost?: number | null
          created_at?: string
          farm_id: string
          flight_date: string
          id?: string
          kind: string
          metadata?: Json
          ndvi_url?: string | null
          notes?: string | null
          orthomosaic_url?: string | null
          plot_id?: string | null
          stress_area_acres?: number | null
          stress_zones_geom?: unknown
          thermal_url?: string | null
          vendor?: string | null
        }
        Update: {
          avg_ndvi?: number | null
          cost?: number | null
          created_at?: string
          farm_id?: string
          flight_date?: string
          id?: string
          kind?: string
          metadata?: Json
          ndvi_url?: string | null
          notes?: string | null
          orthomosaic_url?: string | null
          plot_id?: string | null
          stress_area_acres?: number | null
          stress_zones_geom?: unknown
          thermal_url?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "remote_sensing_runs_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "remote_sensing_runs_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      rule_firings: {
        Row: {
          actions_taken: Json | null
          created_at: string
          error: string | null
          farm_id: string
          fired_at: string
          id: string
          outcome: string | null
          rule_id: string
          trigger_payload: Json | null
        }
        Insert: {
          actions_taken?: Json | null
          created_at?: string
          error?: string | null
          farm_id: string
          fired_at?: string
          id?: string
          outcome?: string | null
          rule_id: string
          trigger_payload?: Json | null
        }
        Update: {
          actions_taken?: Json | null
          created_at?: string
          error?: string | null
          farm_id?: string
          fired_at?: string
          id?: string
          outcome?: string | null
          rule_id?: string
          trigger_payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "rule_firings_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rule_firings_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      sensor_readings: {
        Row: {
          device_id: string
          farm_id: string
          metric: string
          occurred_at: string
          quality: number | null
          unit: string | null
          value: number
        }
        Insert: {
          device_id: string
          farm_id: string
          metric: string
          occurred_at: string
          quality?: number | null
          unit?: string | null
          value: number
        }
        Update: {
          device_id?: string
          farm_id?: string
          metric?: string
          occurred_at?: string
          quality?: number | null
          unit?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "sensor_readings_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      sensor_readings_default: {
        Row: {
          device_id: string
          farm_id: string
          metric: string
          occurred_at: string
          quality: number | null
          unit: string | null
          value: number
        }
        Insert: {
          device_id: string
          farm_id: string
          metric: string
          occurred_at: string
          quality?: number | null
          unit?: string | null
          value: number
        }
        Update: {
          device_id?: string
          farm_id?: string
          metric?: string
          occurred_at?: string
          quality?: number | null
          unit?: string | null
          value?: number
        }
        Relationships: []
      }
      skus: {
        Row: {
          allowed_under_certifications: string[] | null
          category: Database["public"]["Enums"]["inventory_category"]
          code: string
          created_at: string
          default_withdrawal_meat_days: number | null
          default_withdrawal_milk_hours: number | null
          farm_id: string
          id: string
          is_consumable: boolean
          is_organic_compliant: boolean
          is_withdrawal_tracked: boolean
          metadata: Json
          name: string
          preferred_supplier_id: string | null
          reorder_point: number | null
          reorder_qty: number | null
          unit: string
          updated_at: string
        }
        Insert: {
          allowed_under_certifications?: string[] | null
          category: Database["public"]["Enums"]["inventory_category"]
          code: string
          created_at?: string
          default_withdrawal_meat_days?: number | null
          default_withdrawal_milk_hours?: number | null
          farm_id: string
          id?: string
          is_consumable?: boolean
          is_organic_compliant?: boolean
          is_withdrawal_tracked?: boolean
          metadata?: Json
          name: string
          preferred_supplier_id?: string | null
          reorder_point?: number | null
          reorder_qty?: number | null
          unit: string
          updated_at?: string
        }
        Update: {
          allowed_under_certifications?: string[] | null
          category?: Database["public"]["Enums"]["inventory_category"]
          code?: string
          created_at?: string
          default_withdrawal_meat_days?: number | null
          default_withdrawal_milk_hours?: number | null
          farm_id?: string
          id?: string
          is_consumable?: boolean
          is_organic_compliant?: boolean
          is_withdrawal_tracked?: boolean
          metadata?: Json
          name?: string
          preferred_supplier_id?: string | null
          reorder_point?: number | null
          reorder_qty?: number | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skus_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skus_preferred_supplier_id_fkey"
            columns: ["preferred_supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      soil_samples: {
        Row: {
          available_k_kg_ha: number | null
          available_n_kg_ha: number | null
          available_p_kg_ha: number | null
          created_at: string
          depth_cm: number | null
          ec_ds_m: number | null
          farm_id: string
          full_results: Json
          id: string
          lab_name: string | null
          lab_report_url: string | null
          microbial_biomass_ug: number | null
          organic_carbon_pct: number | null
          ph: number | null
          plot_id: string
          recommendations: string | null
          sampled_at: string
          sulfur_kg_ha: number | null
          texture: string | null
          zinc_ppm: number | null
        }
        Insert: {
          available_k_kg_ha?: number | null
          available_n_kg_ha?: number | null
          available_p_kg_ha?: number | null
          created_at?: string
          depth_cm?: number | null
          ec_ds_m?: number | null
          farm_id: string
          full_results?: Json
          id?: string
          lab_name?: string | null
          lab_report_url?: string | null
          microbial_biomass_ug?: number | null
          organic_carbon_pct?: number | null
          ph?: number | null
          plot_id: string
          recommendations?: string | null
          sampled_at: string
          sulfur_kg_ha?: number | null
          texture?: string | null
          zinc_ppm?: number | null
        }
        Update: {
          available_k_kg_ha?: number | null
          available_n_kg_ha?: number | null
          available_p_kg_ha?: number | null
          created_at?: string
          depth_cm?: number | null
          ec_ds_m?: number | null
          farm_id?: string
          full_results?: Json
          id?: string
          lab_name?: string | null
          lab_report_url?: string | null
          microbial_biomass_ug?: number | null
          organic_carbon_pct?: number | null
          ph?: number | null
          plot_id?: string
          recommendations?: string | null
          sampled_at?: string
          sulfur_kg_ha?: number | null
          texture?: string | null
          zinc_ppm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "soil_samples_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "soil_samples_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      species: {
        Row: {
          code: string
          created_at: string
          gestation_days: number | null
          hindi_label: string | null
          kingdom: string | null
          label: string
          metadata: Json
          telugu_label: string | null
          tracks_individually: boolean
          typical_lifespan_years: number | null
        }
        Insert: {
          code: string
          created_at?: string
          gestation_days?: number | null
          hindi_label?: string | null
          kingdom?: string | null
          label: string
          metadata?: Json
          telugu_label?: string | null
          tracks_individually?: boolean
          typical_lifespan_years?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          gestation_days?: number | null
          hindi_label?: string | null
          kingdom?: string | null
          label?: string
          metadata?: Json
          telugu_label?: string | null
          tracks_individually?: boolean
          typical_lifespan_years?: number | null
        }
        Relationships: []
      }
      structures: {
        Row: {
          boundary_geom: unknown
          capacity: number | null
          climate_targets: Json
          code: string
          created_at: string
          deleted_at: string | null
          farm_id: string
          id: string
          kind: string
          metadata: Json
          name: string
          updated_at: string
        }
        Insert: {
          boundary_geom?: unknown
          capacity?: number | null
          climate_targets?: Json
          code: string
          created_at?: string
          deleted_at?: string | null
          farm_id: string
          id?: string
          kind: string
          metadata?: Json
          name: string
          updated_at?: string
        }
        Update: {
          boundary_geom?: unknown
          capacity?: number | null
          climate_targets?: Json
          code?: string
          created_at?: string
          deleted_at?: string | null
          farm_id?: string
          id?: string
          kind?: string
          metadata?: Json
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "structures_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cadence: string
          cancelled_at: string | null
          created_at: string
          customer_id: string
          delivery_slot: string | null
          delivery_weekday: number | null
          e_mandate_ref: string | null
          farm_id: string
          id: string
          items: Json
          next_delivery_date: string | null
          paused_until: string | null
          plan_code: string
          status: Database["public"]["Enums"]["subscription_status"]
          total: number
          updated_at: string
        }
        Insert: {
          cadence: string
          cancelled_at?: string | null
          created_at?: string
          customer_id: string
          delivery_slot?: string | null
          delivery_weekday?: number | null
          e_mandate_ref?: string | null
          farm_id: string
          id?: string
          items: Json
          next_delivery_date?: string | null
          paused_until?: string | null
          plan_code: string
          status?: Database["public"]["Enums"]["subscription_status"]
          total: number
          updated_at?: string
        }
        Update: {
          cadence?: string
          cancelled_at?: string | null
          created_at?: string
          customer_id?: string
          delivery_slot?: string | null
          delivery_weekday?: number | null
          e_mandate_ref?: string | null
          farm_id?: string
          id?: string
          items?: Json
          next_delivery_date?: string | null
          paused_until?: string | null
          plan_code?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      subsidy_claims: {
        Row: {
          amount_approved: number | null
          amount_disbursed: number | null
          amount_expected: number | null
          approved_at: string | null
          created_at: string
          deadline: string | null
          disbursed_at: string | null
          farm_id: string
          form_draft: Json
          id: string
          metadata: Json
          notes: string | null
          period_label: string | null
          receipt_url: string | null
          scheme_id: string
          status: Database["public"]["Enums"]["subsidy_status"]
          submitted_at: string | null
          submitted_pdf_url: string | null
          transaction_id: string | null
          updated_at: string
          window_end: string | null
          window_start: string | null
        }
        Insert: {
          amount_approved?: number | null
          amount_disbursed?: number | null
          amount_expected?: number | null
          approved_at?: string | null
          created_at?: string
          deadline?: string | null
          disbursed_at?: string | null
          farm_id: string
          form_draft?: Json
          id?: string
          metadata?: Json
          notes?: string | null
          period_label?: string | null
          receipt_url?: string | null
          scheme_id: string
          status?: Database["public"]["Enums"]["subsidy_status"]
          submitted_at?: string | null
          submitted_pdf_url?: string | null
          transaction_id?: string | null
          updated_at?: string
          window_end?: string | null
          window_start?: string | null
        }
        Update: {
          amount_approved?: number | null
          amount_disbursed?: number | null
          amount_expected?: number | null
          approved_at?: string | null
          created_at?: string
          deadline?: string | null
          disbursed_at?: string | null
          farm_id?: string
          form_draft?: Json
          id?: string
          metadata?: Json
          notes?: string | null
          period_label?: string | null
          receipt_url?: string | null
          scheme_id?: string
          status?: Database["public"]["Enums"]["subsidy_status"]
          submitted_at?: string | null
          submitted_pdf_url?: string | null
          transaction_id?: string | null
          updated_at?: string
          window_end?: string | null
          window_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subsidy_claims_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subsidy_claims_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "subsidy_schemes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subsidy_claims_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      subsidy_schemes: {
        Row: {
          authority: string | null
          code: string
          created_at: string
          eligibility: Json
          form_template_url: string | null
          frequency: string | null
          id: string
          label: string
          max_amount: number | null
          metadata: Json
          portal_url: string | null
          scope: string | null
          state: string | null
        }
        Insert: {
          authority?: string | null
          code: string
          created_at?: string
          eligibility?: Json
          form_template_url?: string | null
          frequency?: string | null
          id?: string
          label: string
          max_amount?: number | null
          metadata?: Json
          portal_url?: string | null
          scope?: string | null
          state?: string | null
        }
        Update: {
          authority?: string | null
          code?: string
          created_at?: string
          eligibility?: Json
          form_template_url?: string | null
          frequency?: string | null
          id?: string
          label?: string
          max_amount?: number | null
          metadata?: Json
          portal_url?: string | null
          scope?: string | null
          state?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: Json
          cert_body: string | null
          cert_document_url: string | null
          cert_number: string | null
          cert_status: Database["public"]["Enums"]["cert_status"]
          cert_valid_from: string | null
          cert_valid_until: string | null
          created_at: string
          email: string | null
          farm_id: string
          gstin: string | null
          id: string
          is_active: boolean
          kind: string | null
          metadata: Json
          name: string
          phone: string | null
          score_pct: number | null
          updated_at: string
        }
        Insert: {
          address?: Json
          cert_body?: string | null
          cert_document_url?: string | null
          cert_number?: string | null
          cert_status?: Database["public"]["Enums"]["cert_status"]
          cert_valid_from?: string | null
          cert_valid_until?: string | null
          created_at?: string
          email?: string | null
          farm_id: string
          gstin?: string | null
          id?: string
          is_active?: boolean
          kind?: string | null
          metadata?: Json
          name: string
          phone?: string | null
          score_pct?: number | null
          updated_at?: string
        }
        Update: {
          address?: Json
          cert_body?: string | null
          cert_document_url?: string | null
          cert_number?: string | null
          cert_status?: Database["public"]["Enums"]["cert_status"]
          cert_valid_from?: string | null
          cert_valid_until?: string | null
          created_at?: string
          email?: string | null
          farm_id?: string
          gstin?: string | null
          id?: string
          is_active?: boolean
          kind?: string | null
          metadata?: Json
          name?: string
          phone?: string | null
          score_pct?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_profile_id: string | null
          assigned_worker_id: string | null
          auto_completes: boolean | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_at: string | null
          farm_id: string
          id: string
          metadata: Json
          priority: Database["public"]["Enums"]["task_priority"]
          reference_id: string | null
          reference_kind: string | null
          source: Database["public"]["Enums"]["event_source"]
          source_rule_id: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_profile_id?: string | null
          assigned_worker_id?: string | null
          auto_completes?: boolean | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_at?: string | null
          farm_id: string
          id?: string
          metadata?: Json
          priority?: Database["public"]["Enums"]["task_priority"]
          reference_id?: string | null
          reference_kind?: string | null
          source?: Database["public"]["Enums"]["event_source"]
          source_rule_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_profile_id?: string | null
          assigned_worker_id?: string | null
          auto_completes?: boolean | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_at?: string | null
          farm_id?: string
          id?: string
          metadata?: Json
          priority?: Database["public"]["Enums"]["task_priority"]
          reference_id?: string | null
          reference_kind?: string | null
          source?: Database["public"]["Enums"]["event_source"]
          source_rule_id?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_profile_id_fkey"
            columns: ["assigned_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assigned_worker_id_fkey"
            columns: ["assigned_worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_source_rule_fk"
            columns: ["source_rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category_id: string | null
          cost_center_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          farm_id: string
          gst_amount: number | null
          id: string
          invoice_number: string | null
          invoice_url: string | null
          metadata: Json
          net_amount: number | null
          notes: string | null
          occurred_at: string
          ocr_extracted: Json | null
          party_gstin: string | null
          party_name: string | null
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          reference_id: string | null
          reference_kind: string | null
          source: Database["public"]["Enums"]["event_source"]
          txn_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          category_id?: string | null
          cost_center_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          farm_id: string
          gst_amount?: number | null
          id?: string
          invoice_number?: string | null
          invoice_url?: string | null
          metadata?: Json
          net_amount?: number | null
          notes?: string | null
          occurred_at?: string
          ocr_extracted?: Json | null
          party_gstin?: string | null
          party_name?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reference_id?: string | null
          reference_kind?: string | null
          source?: Database["public"]["Enums"]["event_source"]
          txn_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          category_id?: string | null
          cost_center_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          farm_id?: string
          gst_amount?: number | null
          id?: string
          invoice_number?: string | null
          invoice_url?: string | null
          metadata?: Json
          net_amount?: number | null
          notes?: string | null
          occurred_at?: string
          ocr_extracted?: Json | null
          party_gstin?: string | null
          party_name?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reference_id?: string | null
          reference_kind?: string | null
          source?: Database["public"]["Enums"]["event_source"]
          txn_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "txn_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      txn_categories: {
        Row: {
          code: string
          created_at: string
          farm_id: string
          gst_rate_pct: number | null
          hsn_sac: string | null
          id: string
          is_ag_income: boolean | null
          label: string
          parent_id: string | null
          txn_type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          code: string
          created_at?: string
          farm_id: string
          gst_rate_pct?: number | null
          hsn_sac?: string | null
          id?: string
          is_ag_income?: boolean | null
          label: string
          parent_id?: string | null
          txn_type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          code?: string
          created_at?: string
          farm_id?: string
          gst_rate_pct?: number | null
          hsn_sac?: string | null
          id?: string
          is_ag_income?: boolean | null
          label?: string
          parent_id?: string | null
          txn_type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "txn_categories_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "txn_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "txn_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      welfare_events: {
        Row: {
          animal_id: string | null
          camera_id: string | null
          clip_url: string | null
          created_at: string
          duration_seconds: number | null
          farm_id: string
          flock_id: string | null
          id: string
          metadata: Json
          ml_confidence: number | null
          ml_model_version: string | null
          observed_at: string
          severity: string | null
          signal: Database["public"]["Enums"]["welfare_signal"]
          source: Database["public"]["Enums"]["event_source"]
          structure_id: string | null
        }
        Insert: {
          animal_id?: string | null
          camera_id?: string | null
          clip_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          farm_id: string
          flock_id?: string | null
          id?: string
          metadata?: Json
          ml_confidence?: number | null
          ml_model_version?: string | null
          observed_at?: string
          severity?: string | null
          signal: Database["public"]["Enums"]["welfare_signal"]
          source?: Database["public"]["Enums"]["event_source"]
          structure_id?: string | null
        }
        Update: {
          animal_id?: string | null
          camera_id?: string | null
          clip_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          farm_id?: string
          flock_id?: string | null
          id?: string
          metadata?: Json
          ml_confidence?: number | null
          ml_model_version?: string | null
          observed_at?: string
          severity?: string | null
          signal?: Database["public"]["Enums"]["welfare_signal"]
          source?: Database["public"]["Enums"]["event_source"]
          structure_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "welfare_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "welfare_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animals_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "welfare_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_animals_quarantined"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "welfare_events_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_estrus"
            referencedColumns: ["animal_id"]
          },
          {
            foreignKeyName: "welfare_events_camera_fk"
            columns: ["camera_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "welfare_events_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "welfare_events_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "welfare_events_structure_id_fkey"
            columns: ["structure_id"]
            isOneToOne: false
            referencedRelation: "structures"
            referencedColumns: ["id"]
          },
        ]
      }
      welfare_rollups: {
        Row: {
          body_cond_avg: number | null
          crowding_pct: number | null
          farm_id: string
          flock_id: string | null
          generated_at: string
          id: string
          lameness_pct: number | null
          metadata: Json
          observation_hours: number | null
          panting_pct: number | null
          period_end: string
          period_start: string
          species_code: string | null
          stress_free_hours_pct: number | null
          vocalization_pct: number | null
        }
        Insert: {
          body_cond_avg?: number | null
          crowding_pct?: number | null
          farm_id: string
          flock_id?: string | null
          generated_at?: string
          id?: string
          lameness_pct?: number | null
          metadata?: Json
          observation_hours?: number | null
          panting_pct?: number | null
          period_end: string
          period_start: string
          species_code?: string | null
          stress_free_hours_pct?: number | null
          vocalization_pct?: number | null
        }
        Update: {
          body_cond_avg?: number | null
          crowding_pct?: number | null
          farm_id?: string
          flock_id?: string | null
          generated_at?: string
          id?: string
          lameness_pct?: number | null
          metadata?: Json
          observation_hours?: number | null
          panting_pct?: number | null
          period_end?: string
          period_start?: string
          species_code?: string | null
          stress_free_hours_pct?: number | null
          vocalization_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "welfare_rollups_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "welfare_rollups_flock_id_fkey"
            columns: ["flock_id"]
            isOneToOne: false
            referencedRelation: "flocks"
            referencedColumns: ["id"]
          },
        ]
      }
      workers: {
        Row: {
          aadhaar_last4: string | null
          account_number_last4: string | null
          code: string
          created_at: string
          date_joined: string | null
          date_left: string | null
          esic_enabled: boolean | null
          esic_number: string | null
          farm_id: string
          full_name: string
          id: string
          ifsc: string | null
          is_active: boolean
          is_piece_rate: boolean | null
          metadata: Json
          pf_enabled: boolean | null
          phone: string | null
          piece_rate: Json | null
          primary_lang: string | null
          profile_id: string | null
          role_label: string | null
          skills: string[] | null
          uan: string | null
          updated_at: string
          wage_currency: string | null
          wage_rate_per_day: number | null
        }
        Insert: {
          aadhaar_last4?: string | null
          account_number_last4?: string | null
          code: string
          created_at?: string
          date_joined?: string | null
          date_left?: string | null
          esic_enabled?: boolean | null
          esic_number?: string | null
          farm_id: string
          full_name: string
          id?: string
          ifsc?: string | null
          is_active?: boolean
          is_piece_rate?: boolean | null
          metadata?: Json
          pf_enabled?: boolean | null
          phone?: string | null
          piece_rate?: Json | null
          primary_lang?: string | null
          profile_id?: string | null
          role_label?: string | null
          skills?: string[] | null
          uan?: string | null
          updated_at?: string
          wage_currency?: string | null
          wage_rate_per_day?: number | null
        }
        Update: {
          aadhaar_last4?: string | null
          account_number_last4?: string | null
          code?: string
          created_at?: string
          date_joined?: string | null
          date_left?: string | null
          esic_enabled?: boolean | null
          esic_number?: string | null
          farm_id?: string
          full_name?: string
          id?: string
          ifsc?: string | null
          is_active?: boolean
          is_piece_rate?: boolean | null
          metadata?: Json
          pf_enabled?: boolean | null
          phone?: string | null
          piece_rate?: Json | null
          primary_lang?: string | null
          profile_id?: string | null
          role_label?: string | null
          skills?: string[] | null
          uan?: string | null
          updated_at?: string
          wage_currency?: string | null
          wage_rate_per_day?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workers_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      zones: {
        Row: {
          boundary_geom: unknown
          code: string
          created_at: string
          farm_id: string
          id: string
          kind: string
          metadata: Json
          name: string
          parent_plot_id: string | null
          parent_structure_id: string | null
          updated_at: string
        }
        Insert: {
          boundary_geom?: unknown
          code: string
          created_at?: string
          farm_id: string
          id?: string
          kind: string
          metadata?: Json
          name: string
          parent_plot_id?: string | null
          parent_structure_id?: string | null
          updated_at?: string
        }
        Update: {
          boundary_geom?: unknown
          code?: string
          created_at?: string
          farm_id?: string
          id?: string
          kind?: string
          metadata?: Json
          name?: string
          parent_plot_id?: string | null
          parent_structure_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "zones_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "zones_parent_plot_id_fkey"
            columns: ["parent_plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "zones_parent_structure_id_fkey"
            columns: ["parent_structure_id"]
            isOneToOne: false
            referencedRelation: "structures"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      inventory_lot_lineage: {
        Row: {
          ancestor_id: string | null
          depth: number | null
          id: string | null
        }
        Relationships: []
      }
      v_animals_active: {
        Row: {
          acquired_at: string | null
          acquisition_cost: number | null
          acquisition_kind: string | null
          acquisition_source: string | null
          breed_id: string | null
          breed_label: string | null
          created_at: string | null
          created_by: string | null
          current_structure_id: string | null
          dam_id: string | null
          date_of_birth: string | null
          days_in_milk: number | null
          external_ids: Json | null
          farm_id: string | null
          health_state:
            | Database["public"]["Enums"]["animal_health_state"]
            | null
          id: string | null
          lactation_number: number | null
          last_calving_date: string | null
          last_production_at: string | null
          lifecycle: Database["public"]["Enums"]["animal_lifecycle"] | null
          metadata: Json | null
          name: string | null
          predicted_next_estrus_at: string | null
          retired_at: string | null
          retirement_reason: string | null
          rfid_tag: string | null
          sex: Database["public"]["Enums"]["sex"] | null
          sire_id: string | null
          species_code: string | null
          species_label: string | null
          structure_name: string | null
          tag: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animals_breed_id_fkey"
            columns: ["breed_id"]
            isOneToOne: false
            referencedRelation: "breeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_current_structure_id_fkey"
            columns: ["current_structure_id"]
            isOneToOne: false
            referencedRelation: "structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_dam_id_fkey"
            columns: ["dam_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_dam_id_fkey"
            columns: ["dam_id"]
            isOneToOne: false
            referencedRelation: "v_animals_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_dam_id_fkey"
            columns: ["dam_id"]
            isOneToOne: false
            referencedRelation: "v_animals_quarantined"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_dam_id_fkey"
            columns: ["dam_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_estrus"
            referencedColumns: ["animal_id"]
          },
          {
            foreignKeyName: "animals_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "v_animals_active"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "v_animals_quarantined"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_sire_id_fkey"
            columns: ["sire_id"]
            isOneToOne: false
            referencedRelation: "v_upcoming_estrus"
            referencedColumns: ["animal_id"]
          },
          {
            foreignKeyName: "animals_species_code_fkey"
            columns: ["species_code"]
            isOneToOne: false
            referencedRelation: "species"
            referencedColumns: ["code"]
          },
        ]
      }
      v_animals_quarantined: {
        Row: {
          drug_name: string | null
          farm_id: string | null
          id: string | null
          name: string | null
          tag: string | null
          withdrawal_until_milk: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animals_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      v_carbon_net: {
        Row: {
          emitted_tco2e: number | null
          farm_id: string | null
          net_tco2e: number | null
          sequestered_tco2e: number | null
        }
        Relationships: [
          {
            foreignKeyName: "carbon_entries_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      v_daily_milk: {
        Row: {
          contributing_animals: number | null
          day: string | null
          farm_id: string | null
          quarantined_l: number | null
          saleable_l: number | null
          total_l: number | null
        }
        Relationships: [
          {
            foreignKeyName: "production_events_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      v_inventory_onhand: {
        Row: {
          category: Database["public"]["Enums"]["inventory_category"] | null
          earliest_expiry: string | null
          farm_id: string | null
          name: string | null
          needs_reorder: boolean | null
          on_hand: number | null
          reorder_point: number | null
          sku_id: string | null
          unit: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skus_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      v_pnl_mtd: {
        Row: {
          cost_center: string | null
          cost_center_id: string | null
          expense: number | null
          farm_id: string | null
          income: number | null
          net: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      v_upcoming_estrus: {
        Row: {
          animal_id: string | null
          breed_id: string | null
          farm_id: string | null
          ml_confidence: number | null
          name: string | null
          predicted_window_end: string | null
          predicted_window_start: string | null
          tag: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animals_breed_id_fkey"
            columns: ["breed_id"]
            isOneToOne: false
            referencedRelation: "breeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      v_welfare_latest: {
        Row: {
          crowding_pct: number | null
          farm_id: string | null
          panting_pct: number | null
          period_end: string | null
          species_code: string | null
          stress_free_hours_pct: number | null
          vocalization_pct: number | null
        }
        Relationships: [
          {
            foreignKeyName: "welfare_rollups_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      current_farm_id: { Args: never; Returns: string }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      gettransactionid: { Args: never; Returns: unknown }
      is_member: {
        Args: {
          _farm_id: string
          _roles?: Database["public"]["Enums"]["user_role"][]
        }
        Returns: boolean
      }
      json_matches_schema: {
        Args: { instance: Json; schema: Json }
        Returns: boolean
      }
      jsonb_matches_schema: {
        Args: { instance: Json; schema: Json }
        Returns: boolean
      }
      jsonschema_is_valid: { Args: { schema: Json }; Returns: boolean }
      jsonschema_validation_errors: {
        Args: { instance: Json; schema: Json }
        Returns: string[]
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      record_milk: {
        Args: {
          _animal_id: string
          _farm_id: string
          _fat_pct?: number
          _idempotency_key?: string
          _litres: number
          _scc?: number
          _shift?: string
          _snf_pct?: number
          _structure_id?: string
        }
        Returns: string
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      sign_prescription: {
        Args: {
          _animal_id: string
          _dose_unit: string
          _dose_value: number
          _drug_name: string
          _duration_days: number
          _farm_id: string
          _frequency: string
          _inventory_lot_id?: string
          _meat_withdrawal_days: number
          _milk_withdrawal_hours: number
          _notes?: string
          _route: string
        }
        Returns: string
      }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
    }
    Enums: {
      animal_health_state:
        | "healthy"
        | "in_heat"
        | "sick"
        | "quarantined"
        | "recovering"
        | "weaning"
      animal_lifecycle:
        | "calf"
        | "heifer"
        | "lactating"
        | "dry"
        | "pregnant"
        | "breeding_bull"
        | "retired"
        | "sold"
        | "deceased"
      breeding_event_type:
        | "heat_observed"
        | "heat_predicted"
        | "service"
        | "natural_mating"
        | "pregnancy_check"
        | "abortion"
        | "parturition"
        | "weaning"
      cert_status: "valid" | "expiring_soon" | "expired" | "pending" | "revoked"
      cost_center_type:
        | "dairy"
        | "small_ruminants"
        | "poultry"
        | "crops"
        | "storefront"
        | "infra"
        | "admin"
        | "compost"
        | "other"
      device_status: "online" | "offline" | "warn" | "maintenance" | "retired"
      event_source:
        | "manual"
        | "sensor"
        | "rule"
        | "ml"
        | "external"
        | "vet"
        | "api"
        | "import"
      flock_purpose:
        | "layer"
        | "broiler"
        | "breeding"
        | "meat_goat"
        | "dairy_goat"
        | "meat_sheep"
        | "wool_sheep"
        | "dual_purpose"
      health_event_type:
        | "observation"
        | "symptom"
        | "diagnosis"
        | "treatment"
        | "vaccination"
        | "deworming"
        | "surgery"
        | "recovery"
        | "quarantine"
        | "death"
      inventory_category:
        | "feed"
        | "seed"
        | "medicine"
        | "vaccine"
        | "fertilizer"
        | "bio_input"
        | "packaging"
        | "equipment"
        | "harvested_produce"
        | "processed_goods"
        | "other"
      order_status:
        | "new"
        | "confirmed"
        | "packing"
        | "routed"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
        | "refunded"
      payment_status: "pending" | "processing" | "paid" | "failed" | "refunded"
      plot_stage:
        | "fallow"
        | "prep"
        | "sown"
        | "germination"
        | "vegetative"
        | "tillering"
        | "flowering"
        | "fruiting"
        | "ripening"
        | "harvest"
        | "post_harvest"
      production_type:
        | "milk"
        | "egg"
        | "weight"
        | "meat"
        | "honey"
        | "manure"
        | "fleece"
        | "vegetable"
        | "grain"
        | "fruit"
      quarantine_reason:
        | "antibiotic_withdrawal"
        | "disease"
        | "suspected"
        | "voluntary"
      sex: "male" | "female" | "unknown"
      subscription_status: "active" | "paused" | "cancelled" | "ended"
      subsidy_status:
        | "eligible"
        | "draft"
        | "ready"
        | "submitted"
        | "approved"
        | "rejected"
        | "disbursed"
        | "expired"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "backlog" | "today" | "in_progress" | "done" | "cancelled"
      transaction_type: "income" | "expense" | "transfer" | "adjustment"
      unit_system: "metric" | "imperial" | "count" | "currency"
      user_role:
        | "owner"
        | "manager"
        | "worker"
        | "vet"
        | "agronomist"
        | "accountant"
        | "customer"
      welfare_signal:
        | "panting"
        | "crowding"
        | "vocalization"
        | "lameness"
        | "body_condition"
        | "huddling"
        | "pecking"
        | "mounting"
        | "predator"
        | "normal"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      animal_health_state: [
        "healthy",
        "in_heat",
        "sick",
        "quarantined",
        "recovering",
        "weaning",
      ],
      animal_lifecycle: [
        "calf",
        "heifer",
        "lactating",
        "dry",
        "pregnant",
        "breeding_bull",
        "retired",
        "sold",
        "deceased",
      ],
      breeding_event_type: [
        "heat_observed",
        "heat_predicted",
        "service",
        "natural_mating",
        "pregnancy_check",
        "abortion",
        "parturition",
        "weaning",
      ],
      cert_status: ["valid", "expiring_soon", "expired", "pending", "revoked"],
      cost_center_type: [
        "dairy",
        "small_ruminants",
        "poultry",
        "crops",
        "storefront",
        "infra",
        "admin",
        "compost",
        "other",
      ],
      device_status: ["online", "offline", "warn", "maintenance", "retired"],
      event_source: [
        "manual",
        "sensor",
        "rule",
        "ml",
        "external",
        "vet",
        "api",
        "import",
      ],
      flock_purpose: [
        "layer",
        "broiler",
        "breeding",
        "meat_goat",
        "dairy_goat",
        "meat_sheep",
        "wool_sheep",
        "dual_purpose",
      ],
      health_event_type: [
        "observation",
        "symptom",
        "diagnosis",
        "treatment",
        "vaccination",
        "deworming",
        "surgery",
        "recovery",
        "quarantine",
        "death",
      ],
      inventory_category: [
        "feed",
        "seed",
        "medicine",
        "vaccine",
        "fertilizer",
        "bio_input",
        "packaging",
        "equipment",
        "harvested_produce",
        "processed_goods",
        "other",
      ],
      order_status: [
        "new",
        "confirmed",
        "packing",
        "routed",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "refunded",
      ],
      payment_status: ["pending", "processing", "paid", "failed", "refunded"],
      plot_stage: [
        "fallow",
        "prep",
        "sown",
        "germination",
        "vegetative",
        "tillering",
        "flowering",
        "fruiting",
        "ripening",
        "harvest",
        "post_harvest",
      ],
      production_type: [
        "milk",
        "egg",
        "weight",
        "meat",
        "honey",
        "manure",
        "fleece",
        "vegetable",
        "grain",
        "fruit",
      ],
      quarantine_reason: [
        "antibiotic_withdrawal",
        "disease",
        "suspected",
        "voluntary",
      ],
      sex: ["male", "female", "unknown"],
      subscription_status: ["active", "paused", "cancelled", "ended"],
      subsidy_status: [
        "eligible",
        "draft",
        "ready",
        "submitted",
        "approved",
        "rejected",
        "disbursed",
        "expired",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["backlog", "today", "in_progress", "done", "cancelled"],
      transaction_type: ["income", "expense", "transfer", "adjustment"],
      unit_system: ["metric", "imperial", "count", "currency"],
      user_role: [
        "owner",
        "manager",
        "worker",
        "vet",
        "agronomist",
        "accountant",
        "customer",
      ],
      welfare_signal: [
        "panting",
        "crowding",
        "vocalization",
        "lameness",
        "body_condition",
        "huddling",
        "pecking",
        "mounting",
        "predator",
        "normal",
      ],
    },
  },
} as const
