package com.example.petpro

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button
import com.google.android.material.bottomnavigation.BottomNavigationView

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)


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
