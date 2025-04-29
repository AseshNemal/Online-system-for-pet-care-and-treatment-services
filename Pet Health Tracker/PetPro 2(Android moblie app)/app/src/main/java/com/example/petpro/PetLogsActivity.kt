package com.example.petpro

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.bottomnavigation.BottomNavigationView

class PetLogsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pet_logs)

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

        findViewById<View>(R.id.vaccine_button).setOnClickListener{
            val intent = Intent(this,VaccinationsActivity::class.java)
            startActivity(intent)
        }
    }
}