package cli

import (
	"github.com/spf13/cobra"
)

// NewRootCommand создает корневую команду CLI
func NewRootCommand() *cobra.Command {
	rootCmd := &cobra.Command{
		Use:   "yanghoscript",
		Short: "YanghoScript CLI",
		Long:  "YanghoScript CLI for running and managing .ys scripts",
	}

	// Добавляем команды
	rootCmd.AddCommand(NewRunCommand())

	return rootCmd
}
