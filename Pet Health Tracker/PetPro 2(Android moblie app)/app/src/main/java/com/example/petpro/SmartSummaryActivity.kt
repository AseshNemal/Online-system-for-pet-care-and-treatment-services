package com.example.petpro

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.bottomnavigation.BottomNavigationView

class SmartSummaryActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_smart_summary)

        // Find the views
        val heartRateText: TextView = findViewById(R.id.heartRateText)
        val stepsText: TextView = findViewById(R.id.stepsText)
        val temperatureText: TextView = findViewById(R.id.temperatureText)
        val heartRateProgressBar: ProgressBar = findViewById(R.id.heartRateProgressBar)
        val locationText: TextView = findViewById(R.id.locationText)
        val alertText: TextView = findViewById(R.id.alertText)

        // Example of setting dynamic data
        heartRateText.text = "Heart Rate: 85 BPM"
        stepsText.text = "Steps: 1200"
        temperatureText.text = "Temperature: 38°C"
        heartRateProgressBar.progress = 85
        locationText.text = "Location: Park"
        alertText.text = "Alert: Pet needs rest!"

        findViewById<View>(R.id.calendar_view).setOnClickListener{
            val intent = Intent(this,LivePetLocationsActivity::class.java)
            startActivity(intent)
        }
        findViewById<View>(R.id.day_logs).setOnClickListener{
            val intent = Intent(this,PetLogsActivity::class.java)
            startActivity(intent)
        }
        findViewById<View>(R.id.smart_summary).setOnClickListener{
            val intent = Intent(this,SmartSummaryActivity::class.java)
            startActivity(intent)
        }
        val bottomNavigationView: BottomNavigationView = findViewById(R.id.bottom_navigation)

        // Set default selected item
        bottomNavigationView.selectedItemId = R.id.nav_pet_logs

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
}
