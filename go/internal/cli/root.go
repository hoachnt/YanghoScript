package cli

import (
	"fmt"
	"strings"

	"github.com/spf13/cobra"

	"github.com/hoachnt/yanghoscript/internal/version"
)

// NewRootCommand создает корневую команду CLI
func NewRootCommand() *cobra.Command {
	rootCmd := &cobra.Command{
		Use:   "yanghoscript [file.ys]",
		Short: "YanghoScript CLI",
		Long: fmt.Sprintf(`YanghoScript CLI - run .ys files with the Go interpreter (CHOT, THE, PHANG, lists, ...).

Same as: yanghoscript run <file.ys>
Use --version: must show %s (rewrite-in-go). If not, you are running another binary from PATH.`, version.Version),
		Args: cobra.ArbitraryArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			if len(args) == 0 {
				return cmd.Help()
			}
			if len(args) == 1 && strings.HasSuffix(args[0], ".ys") {
				return RunYSFromPath(args[0])
			}
			return fmt.Errorf("usage: %s run <file.ys> or %s <file.ys>", cmd.Name(), cmd.Name())
		},
	}

	rootCmd.Version = version.Version
	rootCmd.AddCommand(NewRunCommand())

	return rootCmd
}
