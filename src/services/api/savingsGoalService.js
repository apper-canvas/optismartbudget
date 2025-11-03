import { getApperClient } from "@/services/apperClient"
import { toast } from "react-toastify"

class SavingsGoalService {
  constructor() {
    this.apperClient = null
  }

  getClient() {
    if (!this.apperClient) {
      this.apperClient = getApperClient()
    }
    return this.apperClient
  }

  async getAll() {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      const response = await client.fetchRecords('savingsGoals_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "targetAmount_c"}},
          {"field": {"Name": "currentAmount_c"}},
          {"field": {"Name": "deadline_c"}}
        ]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching savings goals:", error)
      throw error
    }
  }

  async getById(id) {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      const response = await client.getRecordById('savingsGoals_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "targetAmount_c"}},
          {"field": {"Name": "currentAmount_c"}},
          {"field": {"Name": "deadline_c"}}
        ]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching savings goal ${id}:`, error)
      throw error
    }
  }

  async create(goalData) {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      // Map field names to database schema
      const mappedData = {
        Name: goalData.name_c || goalData.name,
        name_c: goalData.name_c || goalData.name,
        targetAmount_c: parseFloat(goalData.targetAmount_c || goalData.targetAmount),
        currentAmount_c: parseFloat(goalData.currentAmount_c || goalData.currentAmount || 0),
        deadline_c: goalData.deadline_c || goalData.deadline
      }

      const response = await client.createRecord('savingsGoals_c', {
        records: [mappedData]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} savings goals:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return null
        }
        return response.results.find(r => r.success)?.data
      }

      return response.data
    } catch (error) {
      console.error("Error creating savings goal:", error)
      throw error
    }
  }

  async update(id, goalData) {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      // Map field names to database schema
      const mappedData = {
        Id: parseInt(id),
        Name: goalData.name_c || goalData.name,
        name_c: goalData.name_c || goalData.name,
        targetAmount_c: parseFloat(goalData.targetAmount_c || goalData.targetAmount),
        currentAmount_c: parseFloat(goalData.currentAmount_c || goalData.currentAmount),
        deadline_c: goalData.deadline_c || goalData.deadline
      }

      const response = await client.updateRecord('savingsGoals_c', {
        records: [mappedData]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} savings goals:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return null
        }
        return response.results.find(r => r.success)?.data
      }

      return response.data
    } catch (error) {
      console.error(`Error updating savings goal ${id}:`, error)
      throw error
    }
  }

  async delete(id) {
    try {
      const client = this.getClient()
      if (!client) throw new Error("ApperClient not available")

      const response = await client.deleteRecord('savingsGoals_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} savings goals:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
      }

      return true
    } catch (error) {
      console.error(`Error deleting savings goal ${id}:`, error)
      throw error
    }
  }
}

export const savingsGoalService = new SavingsGoalService()