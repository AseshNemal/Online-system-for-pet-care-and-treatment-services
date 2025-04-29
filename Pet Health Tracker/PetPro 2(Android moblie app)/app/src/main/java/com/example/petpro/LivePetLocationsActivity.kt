package com.example.petpro

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.MapView
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import com.google.android.material.bottomnavigation.BottomNavigationView

class LivePetLocationsActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var mapView: MapView
    private var googleMap: GoogleMap? = null


    // Dummy Pet Locations (Replace with real data later)
    private val petLocations = listOf(
        LatLng(6.9154643, 79.9742903),

    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_live_pet_locations)

        mapView = findViewById(R.id.mapView)
        mapView.onCreate(savedInstanceState)
        mapView.getMapAsync(this)

        findViewById<View>(R.id.calendar_view).setOnClickListener{
            val intent = Intent(this,LivePetLocationsActivity::class.java)
            startActivity(intent)
        }
        findViewById<View>(R.id.day_logs).setOnClickListener{
            val intent = Intent(this,DayLogCalendarActivity::class.java)
            startActivity(intent)
        }
        findViewById<View>(R.id.smart_summary).setOnClickListener{
            val intent = Intent(this,SmartSummaryActivity::class.java)
            startActivity(intent)
        }

        val bottomNavigationView: BottomNavigationView = findViewById(R.id.bottom_navigation)

        // Set default selected item
        bottomNavigationView.selectedItemId = R.id.nav_records

        bottomNavigationView.setOnItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_pet_logs -> {
                    startActivity(Intent(this, MainActivity::class.java))
                    true
                }
                R.id.nav_records -> {
                    startActivity(Intent(this, VaccinationsActivity::class.java))
                    true
                }
                R.id.nav_stats -> {
                    startActivity(Intent(this, PetHealthActivity::class.java))
                    true
                }
                R.id.nav_account -> {
                    startActivity(Intent(this, UserAccountActivity::class.java))
                    true
                }
                else -> false
            }
        }
    }

    override fun onMapReady(map: GoogleMap) {
        googleMap = map


        for (location in petLocations) {
            googleMap?.addMarker(MarkerOptions().position(location).title("Pet Location"))
        }


        if (petLocations.isNotEmpty()) {
            googleMap?.moveCamera(CameraUpdateFactory.newLatLngZoom(petLocations[0], 12f))
        }
    }

    override fun onResume() { super.onResume(); mapView.onResume() }
    override fun onPause() { super.onPause(); mapView.onPause() }
    override fun onDestroy() { super.onDestroy(); mapView.onDestroy() }
    override fun onLowMemory() { super.onLowMemory(); mapView.onLowMemory() }
}
