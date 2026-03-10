import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80, // AddTaskButton用のスペース
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: '#2C3E50',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#95A5A6',
  },
  taskTime: {
    fontSize: 14,
    color: '#95A5A6',
    marginTop: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 8,
  },
  priorityBadge: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
    fontWeight: '600',
  },
  priorityHigh: {
    backgroundColor: '#FFE5E5',
    color: '#FF6B6B',
  },
  priorityMedium: {
    backgroundColor: '#FFF3E0',
    color: '#FFD93D',
  },
  priorityLow: {
    backgroundColor: '#E5F5F5',
    color: '#4ECDC4',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTaskText: {
    textAlign: 'center',
    color: '#95A5A6',
    fontSize: 16,
  },
  addTaskButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addTaskButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
