package com.example.petpro

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.bottomnavigation.BottomNavigationView

class UserAccountActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_account)


        val profileImage: ImageView = findViewById(R.id.profile_image)
        val userName: TextView = findViewById(R.id.user_name)
        val userEmail: TextView = findViewById(R.id.user_email)
        val editProfileButton: Button = findViewById(R.id.edit_profile_button)


        val user = User("John Doe", "johndoe@example.com", R.drawable.ic_profile)


        profileImage.setImageResource(user.profileImage)
        userName.text = user.name
        userEmail.text = user.email


        editProfileButton.setOnClickListener {

        }
        val bottomNavigationView: BottomNavigationView = findViewById(R.id.bottom_navigation)

        // Set default selected item
        bottomNavigationView.selectedItemId = R.id.nav_account

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


data class User(
    val name: String,
    val email: String,
    val profileImage: Int
)