package com.example.petpro.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.petpro.R
import com.example.petpro.model.PetDataModel

class PetDataAdapter(private val dataList: List<PetDataModel>) :
    RecyclerView.Adapter<PetDataAdapter.PetViewHolder>() {

    class PetViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val timestamp: TextView = view.findViewById(R.id.txtTime)
        val temp: TextView = view.findViewById(R.id.txtTemp)
        val heart: TextView = view.findViewById(R.id.txtHeart)
        val step: TextView = view.findViewById(R.id.txtStep)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PetViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_pet_data, parent, false)
        return PetViewHolder(view)
    }

    override fun onBindViewHolder(holder: PetViewHolder, position: Int) {
        val item = dataList[position]
        holder.timestamp.text = item.timestamp
        holder.temp.text = "${item.Temperature} °C"
        holder.heart.text = "${item.hartrate} BPM"
        holder.step.text = item.step
    }

    override fun getItemCount() = dataList.size
}

